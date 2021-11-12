let dom = document.getElementById('webgl')
const gl = dom.getContext('webgl')
let renderer = new THREE.WebGLRenderer({ canvas: dom })
document.body.appendChild(renderer.domElement)

let material = new THREE.ShaderMaterial({
    fragmentShader: `
    precision mediump float;//123
   // uniform vec4 color;
    uniform float opacity;
    varying vec3 v_color;
    void main(){
        gl_FragColor = vec4(v_color,1.0);
    }    
    `,
    vertexShader: `
    attribute vec3 position;
    attribute vec3 color;
    varying vec3 v_color;
    uniform mat4 u_MvpMatrix;
        void main() {
        v_color = color;
        gl_Position = u_MvpMatrix * vec4(position,1.0);
    }
    `,
    uniforms: {
        opacity: 0.6,
        // color: [1.0, 0.0, 0.0, 1.0],
    },
})

let geometrybox = new THREE.BufferGeometry()
let mian1 = {
    geometry: geometrybox.createBufferInfoFromArrays(gl, {
        position: new Float32Array([
            1.0,
            1.0,
            1.0, // v0
            -1.0,
            1.0,
            1.0, // v1
            -1.0,
            -1.0,
            1.0, // v2
        ]),
        color: new Float32Array([
            1.0,
            0.0,
            0.0, // v0 r
            0.0,
            1.0,
            0.0, // v1 g
            1.0,
            0.0,
            1.0, // v2 b
        ]),
        indices: new Uint8Array([0, 1, 2]),
    }),
    material,
}
let scene = new THREE.Scene()
scene.add(mian1)
let camera = new THREE.PerspectiveCamera()
// 循环渲染
function animate() {
    requestAnimationFrame(animate)
    // renderer.mvpMatrix.rotate(-1, 0, 1, 0)
    renderer.render(scene, camera)
}

animate()
