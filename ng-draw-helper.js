/**
 * Created by danielwild on 26/08/2015.
 */

'use strict';

angular.module('cesium.drawhelper', [])

/**
 * A collection of helper functions for drawing shapes etc.
 *
 * Point Marker
 * PolyLine (renders with Primitive, for extruded 'fence')
 * CorridorGeom
 * Polygon
 * Extent
 * Circle
 *
 */


// TODO logging -> flashService?
.factory('drawHelperService', ['$q', 'viewerService', function($q, viewerService) {

	var service = {};

	service.initialised = false;
	service.drawHelper;
	service.scene;
	service.loggingMessage;

	// reuse our shape material
	var material = Cesium.Material.fromType(Cesium.Material.ColorType);
	material.uniforms.color = new Cesium.Color(0, 0, 153, 0.4);

	// create a collection to hold out primitives;
	// keep the markers within their own nested billboard collection
	var primitivesCollection = new Cesium.PrimitiveCollection();
	var billboardCollection = new Cesium.BillboardCollection();

	/**
	 *
	 * @param cesiumWidget Object
	 *
	 * Should work with Cesium.Viewer or Cesium.Widget
	 *
	 */
	service.init = function(cesiumWidget) {

		// create the scene with parent PrimitivesCollection to hold our shapes
		service.scene = cesiumWidget.scene;
		primitivesCollection.add(billboardCollection);
		service.scene.primitives.add(primitivesCollection);

		// start the draw helper to enable shape creation and editing
		service.drawHelper = new DrawHelper(cesiumWidget);

		// init logging
		var logging = document.getElementById('drawlogging');
		service.loggingMessage = function (message) {
			if(logging) {
				logging.innerHTML = message;
			}
		}

		service.initialised = true;

		return service.drawHelper;
	};

	service.getDrawHelper = function(){

		var deferred = $q.defer();

		if(service.initialised){
			deferred.resolve(service);
		}
		else {
			viewerService.getViewer().then(function(viewer){
				service.init(viewer);
				deferred.resolve(service);
			});
		}

		return deferred.promise;
	};

	/**
	 *
	 * Wrapper for DrawHelper.startDrawingMarker
	 *
	 * @param options {
 *      callback: Function,
 *      imgUrl: String
 * }
	 *
	 *
	 */
	service.drawMarker = function(options){

		service.drawHelper.startDrawingMarker({

			callback: function(position) {

				service.loggingMessage('Marker created at ' + position.toString());

				var billboard = billboardCollection.add({
					show : true,
					position : position,
					pixelOffset : new Cesium.Cartesian2(0, 0),
					eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0),
					horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
					verticalOrigin : Cesium.VerticalOrigin.CENTER,
					scale : 1.0,
					image: options.imgUrl,
					color : new Cesium.Color(1.0, 1.0, 1.0, 1.0)
				});
				billboard.setEditable();

				options.hasOwnProperty('callback') ? options.callback(billboard) : console.log(billboard);
			}
		});
	};

	/**
	 *
	 * Wrapper for DrawHelper.startDrawingCorridor
	 *
	 * @param options {
	 *      callback: Function,
	 *      editable: Boolean,
	 *      width: Number,
	 *      geodesic: Boolean
	 * }
	 *
	 */
	service.drawCorridor = function(options){

		service.drawHelper.startDrawingCorridor(
			options.isPrimitive,
			0,
			options.useNumberedPins,
			{

				callback: function(positions) {

					service.loggingMessage('Corridor created with ' + positions.length + ' points');
					var corridor = new DrawHelper.CorridorPrimitive({
						positions: positions,
						width: options.width || 10000,
						height: options.height || 0,
						geodesic: options.hasOwnProperty("geodesic") ? options.geodesic : true
					});

					primitivesCollection.add(corridor);

					if(options.hasOwnProperty("editable") && options.editable){

						corridor.setEditable();
						corridor.addListener('onEdited', function(event) {
							service.loggingMessage('Corridor edited, ' + event.positions.length + ' points');
							options.hasOwnProperty('callback') ? options.callback(corridor) : console.log(corridor);
						});
					}
					options.hasOwnProperty('callback') ? options.callback(corridor) : console.log(corridor);
				}
			});
	};

	/**
	 *
	 * Wrapper for DrawHelper.startDrawingPolyline
	 *
	 * @param options {
	 *      callback: Function,
	 *      editable: Boolean,
	 *      width: Number,
	 *      geodesic: Boolean
	 * }
	 *
	 */
	service.drawPolyline = function(options){

		service.drawHelper.startDrawingPolyline(
			{

				callback: function(positions) {

					service.loggingMessage('Polyline created with ' + positions.length + ' points');
					var polyline = new DrawHelper.PolylinePrimitive({
						positions: positions,
						width: options.width || 10,
						height: options.height || 0,
						editable: options.editable,
						geodesic: options.hasOwnProperty("geodesic") ? options.geodesic : true
					});

					primitivesCollection.add(polyline);

					if(options.hasOwnProperty("editable") && options.editable){

						polyline.setEditable();
						polyline.addListener('onEdited', function(event) {
							service.loggingMessage('Polyline edited, ' + event.positions.length + ' points');
							options.hasOwnProperty('callback') ? options.callback(polyline) : console.log(polyline);
						});
					}
					options.hasOwnProperty('callback') ? options.callback(polyline) : console.log(polyline);
				}
			});
	};

	/**
	 *
	 * Wrapper for DrawHelper.startDrawingFence
	 *
	 * @param options {
 *      callback: Function,
 *      isPrimitive: boolean,
 *      editable: Boolean,
 *      width: Number,
 *      geodesic: Boolean
 * }
	 *
	 */
	service.drawFence = function(options){

		service.drawHelper.startDrawingCorridor(
			options.isPrimitive, // we can extrude Primitives, but not GroundPrimitives
			options.extrudedHeight, // also sets height of billboard markers
			options.useNumberedPins,
			{
				callback: function(positions) {

					service.loggingMessage('Fence created with ' + positions.length + ' points');
					var fence = new DrawHelper.CorridorPrimitive({
						isPrimitive: true,
						positions: positions,
						width: options.width || 10,
						height: options.height || 0,
						extrudedHeight: options.extrudedHeight || 100,
						geodesic: options.hasOwnProperty("geodesic") ? options.geodesic : true
					});

					primitivesCollection.add(fence);
					options.hasOwnProperty('callback') ? options.callback(fence) : console.log(fence);
				}
			});
	};

	/**
	 *
	 * Wrapper for DrawHelper.startDrawingPolygon
	 *
	 * @param options {
 *      callback: Function,
 *       editable: Boolean
 * }
	 *
	 */
	service.drawPolygon = function(options){

		service.drawHelper.startDrawingPolygon({

			callback: function(positions) {

				service.loggingMessage('Polygon created with ' + positions.length + ' points');

				var polygon = new DrawHelper.PolygonPrimitive({
					positions: positions,
					material : material
				});

				primitivesCollection.add(polygon);

				if(options.hasOwnProperty("editable") && options.editable) {

					polygon.setEditable();
					polygon.addListener('onEdited', function (event) {
						console.log(event);
						service.loggingMessage('Polygon edited, ' + event.positions.length + ' points');
						options.hasOwnProperty('callback') ? options.callback(polygon) : console.log(polygon);
					});
				}

				options.hasOwnProperty('callback') ? options.callback(polygon) : console.log(polygon);
			}
		});
	};

	/**
	 *
	 * Wrapper for DrawHelper.startDrawingExtent
	 *
	 * @param options {
 *      callback: Function,
 *      editable: Boolean
 * }
	 *
	 */
	service.drawExtent = function(options){

		service.drawHelper.startDrawingExtent({

			callback: function(extent) {

				service.loggingMessage('Extent created (N: ' + extent.north.toFixed(3) + ', E: ' + extent.east.toFixed(3) + ', S: ' + extent.south.toFixed(3) + ', W: ' + extent.west.toFixed(3) + ')');

				var extentPrimitive = new DrawHelper.ExtentPrimitive({
					extent: extent,
					material: material
				});

				primitivesCollection.add(extentPrimitive);

				if(options.hasOwnProperty("editable") && options.editable) {

					extentPrimitive.setEditable();
					extentPrimitive.addListener('onEdited', function (event) {
						service.loggingMessage('Extent edited: extent is (N: ' + event.extent.north.toFixed(3) + ', E: ' + event.extent.east.toFixed(3) + ', S: ' + event.extent.south.toFixed(3) + ', W: ' + event.extent.west.toFixed(3) + ')');
						options.hasOwnProperty('callback') ? options.callback(extentPrimitive) : console.log(extentPrimitive);
					});
				};

				options.hasOwnProperty('callback') ? options.callback(extentPrimitive) : console.log(extentPrimitive);

			}
		});
	};

	/**
	 *
	 * Wrapper for DrawHelper.startDrawingCircle
	 *
	 * @param options {
	 *      callback: Function,
	 *      editable: Boolean
	 * }
	 *
	 */
	service.drawCircle = function(options){

		service.drawHelper.startDrawingCircle({

			callback: function(center, radius) {

				service.loggingMessage('Circle created: center is ' + center.toString() + ' and radius is ' + radius.toFixed(1) + ' meters');
				var circle = new DrawHelper.CirclePrimitive({
					center: center,
					radius: radius,
					material: material
				});

				primitivesCollection.add(circle);

				if(options.hasOwnProperty("editable") && options.editable) {

					circle.setEditable();
					circle.addListener('onEdited', function (event) {
						service.loggingMessage('Circle edited: radius is ' + event.radius.toFixed(1) + ' meters');
						options.hasOwnProperty('callback') ? options.callback(circle) : console.log(circle);
					});
				};

				options.hasOwnProperty('callback') ? options.callback(circle) : console.log(circle);
			}
		});
	};

	service.removeAllPrimitives = function(){

		primitivesCollection.removeAll();

		// reset collections
		primitivesCollection = new Cesium.PrimitiveCollection();
		billboardCollection = new Cesium.BillboardCollection();
		primitivesCollection.add(billboardCollection);
		service.scene.primitives.add(primitivesCollection);
	};

	/**
	 * @param cartographic
	 * @param precision
	 * @returns {string}
	 */
	service.getDisplayLatLngString = function(cartographic, precision) {
		return Cesium.Math.toDegrees(cartographic.longitude).toFixed(2) + ", " + Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
	};


	return service;

}]);