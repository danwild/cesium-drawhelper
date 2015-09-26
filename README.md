cesium-ng-drawhelper
================

<p>An AngularJS service wrapper for a stripped back version of the cesium-drawhelper plugin (https://github.com/leforthomas/cesium-drawhelper).</p>

<h2>Use:</h2>

Download repo or `$ bower install cesium-ng-drawhelper`

Add the `cesium.drawhelper` module to your angular app, then use the `drawHelperService` to access draw functions.<br/>
(before use, you must init `drawHelperService.init(myCesiumObject)` with your cesium Viewer or Widget). 

All draw functions accept a callback function in the options object which will be called with the created primitive.

Now uses <a href="https://cesiumjs.org/Cesium/Build/Documentation/GroundPrimitive.html">GroundPrimitives</a> from the <a href="http://cesiumjs.org/2015/09/01/Cesium-version-1.13-released/">1.13 release</a> to 'drape' geometries over 3d terrain.

<strong>However:</strong> GroundPrimitives don't yet support Polylines or Billboards (which we use for markers for drawing),
 which still needs some work.

<h2>TODO</h2>
<ul>
	<li>Trigger callback function on edit</li>
	<li>remove function throwing error on circles</li>
	<li>Continue to remove unused plugin components</li>
</ul>

<h2>Notes</h2>
<ul>
	<li>...</li>
</ul>

