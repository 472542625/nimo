import { WebGLRenderer } from './renderers/WebGLRenderer'
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
import { BufferGeometry } from './geometries/BufferGeometry'
import { CubeGeometry } from './geometries/CubeGeometry'

//camear
import { PerspectiveCamera } from './camera/PerspectiveCamera'
let THREE = {
    WebGLRenderer,

    WebGLUniforms,
    WebGLAttributes,

    Scene,

    Object3D,

    Matrix4,
    Vector4,

    ShaderMaterial,

    BufferGeometry,
    CubeGeometry,

    PerspectiveCamera,
}
export { THREE }
