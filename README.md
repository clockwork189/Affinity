<h1>Affinity.js: Affine Fit Transform in Javascript</h1>
<p>
    This library provides an affine fit transformation for a given point by taking in a set of "to and from coordinates".
</p>
<p>
    To use this library ensure you have included <code>affinity.js</code> and its dependency <code>sylvester.js</code> in your project.
</p>
<h2>Usage:</h2>
<p>
    Supply a list of from points and to points into a new instance of the object. Then call the objects accompanying methods to perform the desired operations. <br/>
    <strong>Example:</strong>
    <pre>
        var point = [5,9];
        var from_points = [[1,1],[1,2],[2,2],[2,1]];
        var to_points = [[4,4],[6,6],[8,4],[6,2]];
        var transform_matrix = new AffineTransformation(from_points, to_points);
        var result = transform_matrix.transform(point);
        console.log("The point on the resultant matrix is:", result); // Output: The point on the resultant matrix is: [28.000000000000004, 12.000000000000028]
    </pre>
</p>

