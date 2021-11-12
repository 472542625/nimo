let dom = document.getElementById('webgl')
const gl = dom.getContext('webgl')
let renderer = new THREE.WebGLRenderer({ canvas: dom })
document.body.appendChild(renderer.domElement)

let material = new THREE.ShaderMaterial({
    fragmentShader: `
    precision mediump float;//123
   // uniform vec4 color;
    uniform float opacity;
    varying vec4 v_color;
    void main(){
        gl_FragColor = v_color;
    }    
    `,
    vertexShader: `
    attribute vec4 position;
    attribute vec4 color;
    varying vec4 v_color;
    uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;
        void main() {
        v_color = color;
        gl_Position = projectionMatrix * viewMatrix * vec4(position);
    }
    `,
    uniforms: {
        opacity: 0.6,
        // color: [1.0, 0.0, 0.0, 1.0],
    },
})

let geometrybox = new THREE.BufferGeometry()
let meshbox = {
    geometry: geometrybox.createBufferInfoFromArrays(gl, {
        position: new Float32Array([
            // 顶点坐标和颜色
            1.0,
            1.0,
            1.0, // v0 White
            -1.0,
            1.0,
            1.0, // v1 Magenta
            -1.0,
            -1.0,
            1.0, // v2 Red
            1.0,
            -1.0,
            1.0, // v3 Yellow
            1.0,
            -1.0,
            -1.0, // v4 Green
            1.0,
            1.0,
            -1.0, // v5 Cyan
            -1.0,
            1.0,
            -1.0, // v6 Blue
            -1.0,
            -1.0,
            -1.0, // v7 Black
        ]),
        color: new Float32Array([
            1.0,
            1.0,
            1.0, // v0 White
            1.0,
            0.0,
            1.0, // v1 Magenta
            1.0,
            0.0,
            0.0, // v2 Red
            1.0,
            1.0,
            0.0, // v3 Yellow
            0.0,
            1.0,
            0.0, // v4 Green
            0.0,
            1.0,
            1.0, // v5 Cyan
            0.0,
            0.0,
            1.0, // v6 Blue
            0.0,
            0.0,
            0.0, // v7 Black
        ]),
        indices: new Uint8Array([
            0,
            1,
            2,
            0,
            2,
            3, // front
            0,
            3,
            4,
            0,
            4,
            5, // right
            0,
            5,
            6,
            0,
            6,
            1, // up
            1,
            6,
            7,
            1,
            7,
            2, // left
            7,
            4,
            3,
            7,
            3,
            2, // down
            4,
            7,
            6,
            4,
            6,
            5, // back
        ]),
    }),
    material,
}
let scene = new THREE.Scene()
scene.add(meshbox)
let camera = new THREE.PerspectiveCamera()

// 循环渲染 旋转立方体
function animate() {
    requestAnimationFrame(animate)
    // renderer.mvpMatrix.rotate(-1, 0, 1, 0)
    renderer.render(scene, camera)
}

animate()
