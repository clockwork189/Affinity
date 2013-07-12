# Affinity.js: Affine Fit Transform in JS

This library provides an affine fit transformation for a given point by taking in a set of "to and from coordinates". This is based on a [Research Paper by Helmuth Spath](http://hrcak.srce.hr/file/1425), which was adapted to [Python by Jarno Elonen](http://elonen.iki.fi/code/misc-notes/affine-fit/).

To use this library ensure you have included `affinity.js` and its dependency `sylvester.js` in your project.

## Usage:
Supply a list of from points and to points into a new instance of the object. Then call the objects accompanying methods to perform the desired operations. To transform a point to the targets system we can use the `transform([x,y]);` call.<br />
**Example:**

```js
var point = [5,9];
var from_points = [[1,1],[1,2],[2,2],[2,1]];
var to_points = [[4,4],[6,6],[8,4],[6,2]];
var transform_matrix = new AffineTransformation(from_points, to_points);
var result = transform_matrix.transform(point);
console.log("The point on the resultant matrix is:", result); 
// Output: The point on the resultant matrix is: [28.000000000000004, 12.000000000000028]
```

Another use case for this library is when you want to go from resulting points to original points. In this case we can use the `inverseTransform([x,y]);` call.<br />
**Example:**

```js
var point = [5,9];
var from_points = [[1,1],[1,2],[2,2],[2,1]];
var to_points = [[4,4],[6,6],[8,4],[6,2]];
var transform_matrix = new AffineTransformation(from_points, to_points);
var result = transform_matrix.inverseTransform(point);
console.log("The point on the resultant matrix is:", result); 
// Output: The point on the resultant matrix is: [5.551115123125783e-16, 2.5000000000000018]
```

## Bugs/Fixes:

While I will take care to modify and keep this libray up to date, it is encouraged for everyone to help out and make this library work more efficiently.

## License:

This library is available under the "Do What The Fuck You Want To Public License (<a href="http://www.wtfpl.net/" target="_blank">WTFPL</a>)" agreement. Feel free to copy/modify/distribute this library.
