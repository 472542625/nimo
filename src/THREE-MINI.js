import { WebGLRenderer } from './renderers/WebGLRenderer'

import { WebGLCapabilities } from './renderers/webgl/WebGLCapabilities'
import { WebGLBufferRenderer } from './renderers/webgl/WebGLBufferRenderer'
import { WebGLIndexedBufferRenderer } from './renderers/webgl/WebGLIndexedBufferRenderer'
import { WebGLUniforms } from './renderers/webgl/WebGLUniforms'
import { WebGLAttributes } from './renderers/webgl/WebGLAttributes'

//scenes
import { Scene } from './scenes/Scene'

//core
import { Object3D } from './core/Object3D'

//math
import { Matrix4, Vector4 } from './math/Matrix4'

//materials
import { ShaderMaterial } from './materials/ShaderMaterial'

//geometries
import { CubeGeometry } from './geometries/CubeGeometry'
let THREE = {
    WebGLRenderer,

    WebGLCapabilities,
    WebGLBufferRenderer,
    WebGLIndexedBufferRenderer,
    WebGLUniforms,
    WebGLAttributes,

    Scene,

    Object3D,

    Matrix4,
    Vector4,

    ShaderMaterial,

    CubeGeometry,
}
export { THREE }
