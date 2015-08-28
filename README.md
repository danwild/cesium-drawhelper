cesium-ng-drawhelper
================

<p>An AngularJS service wrapper for DrawHelper (https://github.com/leforthomas/cesium-drawhelper).</p>

<h2>Use:</h2>

Download repo or `$ bower install cesium-ng-drawhelper`

Add the `cesium.drawhelper` module to your angular app, then use the `drawHelperService` to access draw functions.<br/>
(before use, you must call `drawHelperService.init(myCesiumObject)` with your cesium Viewer or Widget). 

All draw functions accept a callback function in the options object which will be called with the created primitive.

<h2>TODO</h2>
<ul>
	<li>Drawing materials don't seem to "drape" over 3d terrain</li>
</ul>

<h2>Notes</h2>
<ul>
	<li>The DrawHelper.js/DrawHelper.css in this fork will be stripped back to remove the UI components etc.</li>
</ul>

