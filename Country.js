let Country = function(geoCoords, properties, lineColor, shapeColor) {
    this.geoCoords = geoCoords;
    this.properties = properties;      
    this.lineColor = (!lineColor) ? 0xff0000 : lineColor; 
    this.shapeColor = (!shapeColor) ? 0x000000 : shapeColor;           
}

Country.prototype = {
    createLine : function() {
        const geometry = new THREE.Geometry();
        for (let P of this.geoCoords.coordinates) {
            if(this.geoCoords.type === "MultiPolygon"){
                P = P[0];
            }

            let p0 = new THREE.Vector3(P[0][0], P[0][1], 0);
            for (let i = 1; i < P.length; ++ i) {

                let p1 = new THREE.Vector3(P[i][0], P[i][1], 0);
                geometry.vertices.push(p0, p1);
                p0 = p1;

            }
        }
         
        let mat = new THREE.LineBasicMaterial({color: this.lineColor});
        let lineSegments = new THREE.LineSegments(geometry, mat); 
        lineSegments.userData = this;
        return lineSegments;
    },

    createShape : function() {
        let vecs2 = [];
        let shapearray = [];
        
        for (let P of this.geoCoords.coordinates) {
            if(this.geoCoords.type === "MultiPolygon") {
                P = P[0];
            } 
                
            let p0 = new THREE.Vector2(P[0][0], P[0][1]);
            for (let i = 1; i < P.length; ++ i) {

                let p1 = new THREE.Vector2(P[i][0], P[i][1]);
                vecs2.push(p0, p1);
                p0 = p1;
            }

            shapearray.push(new THREE.Shape(vecs2));      
            vecs2 = [];
        }

        let mat = new THREE.MeshBasicMaterial({color: this.shapeColor}); 
        let shapeGeo = new THREE.ShapeGeometry(shapearray);
        let mesh = new THREE.Mesh( shapeGeo, mat ) ;
        mesh.userData = this;
        
        return mesh;
    }
};