cesium-ng-drawhelper
================

<p>An AngularJS service wrapper for a stripped back version of the cesium-drawhelper plugin (https://github.com/leforthomas/cesium-drawhelper).</p>

<h2>Use:</h2>

Download repo or `$ bower install cesium-ng-drawhelper`

Add the `cesium.drawhelper` module to your angular app, then use the `drawHelperService` to access draw functions.<br/>
(before use, you must pass in your Cesium Viewer or Widget to init `drawHelperService.init(myCesiumObject)`). 

All draw functions accept a callback function in the options object which will be called with the created primitive.

Now uses <a href="https://cesiumjs.org/Cesium/Build/Documentation/GroundPrimitive.html">GroundPrimitives</a> from the <a href="http://cesiumjs.org/2015/09/01/Cesium-version-1.13-released/">1.13 release</a> to 'drape' geometries over 3d terrain.

<h2>Bugs/Todo:</h2>
<ul>
	<li>For GroundPrimitives; the <code>pickPrimitive</code> property of the <code>GeometryInstance</code> isn't handled the same way (as a Primitive) when picking. As such, the <code>id</code> member has been used to hold a reference to the decorated object.</li>
	<li>GroundPrimitives don't yet support Polylines or Billboards (which we use for markers for drawing), which still needs some work.</li>
	<li>The <code>removeAllPrimitives()</code> function needs a refactor - Billboards aren't deleted if you try to remove a shape while in edit mode.</li>
	<li>Trigger callback function on edit</li>
    <li>Need to inspect function throwing error on circles</li>
    <li>Continue to remove unused plugin components</li>
</ul>
	
</ul>

<h2>Notes</h2>
<ul>
	<li>Added a `useNumberedPins` option for `drawFence`, which uses `Cesium.PinBuilder` to increment the markers. 
	Note that this shouldn't be used with and setEditable enabled, as the mid way points are not considered in the pin indexing.</li>
</ul>

