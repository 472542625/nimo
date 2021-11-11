import { ShaderChunk } from './ShaderChunk.js'
const ShaderLib = {
    custom: {
        uniforms: {},
        vertexShader: ShaderChunk.meshcustom_vert,
        fragmentShader: ShaderChunk.meshcustom_frag,
    },
}

export { ShaderLib }
