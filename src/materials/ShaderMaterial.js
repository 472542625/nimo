import default_vertex from '../renderers/shaders/ShaderLib/default_vertex.glsl.js'
import default_fragment from '../renderers/shaders/ShaderLib/default_fragment.glsl.js'
class ShaderMaterial {
    constructor(opt) {
        let _opt = opt || {}
        let { uniforms = [], vertexShader = default_vertex, fragmentShader = default_fragment } = _opt
        this.vertexShader = vertexShader
        this.fragmentShader = fragmentShader
        this.uniforms = uniforms
        this.version = 0
    }
}
Object.defineProperty(ShaderMaterial.prototype, 'needsUpdate', {
    set: function (value) {
        if (value === true) this.version++
    },
})
export { ShaderMaterial }
