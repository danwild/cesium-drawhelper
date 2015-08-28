cesium-ng-drawhelper
================

<p>An AngularJS service wrapper for a stripped back version of the cesium-drawhelper plugin (https://github.com/leforthomas/cesium-drawhelper).</p>

<h2>Use:</h2>

Download repo or `$ bower install cesium-ng-drawhelper`

Add the `cesium.drawhelper` module to your angular app, then use the `drawHelperService` to access draw functions.<br/>
(before use, you must call `drawHelperService.init(myCesiumObject)` with your cesium Viewer or Widget). 

All draw functions accept a callback function in the options object which will be called with the created primitive.

<h2>TODO</h2>
<ul>
	<li>remove function throwing error on circles</li>
	<li>Continue to remove unused plugin components</li>
	<li>Drawing materials don't seem to "drape" over 3d terrain</li>
</ul>

<h2>Notes</h2>
<ul>
	<li>...</li>
</ul>

