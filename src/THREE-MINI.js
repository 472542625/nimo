import { WebGLRenderer } from './renderers/WebGLRenderer'
import { WebGLUniforms } from './renderers/webgl/WebGLUniforms'
import { WebGLAttributes } from './renderers/webgl/WebGLAttributes'

//scenes
import { Scene } from './scenes/Scene'

//core
import { Object3D } from './core/Object3D'

import { Mesh } from './objects/Mesh'

//math
import { Matrix4, Vector4 } from './math/Matrix4'
import { Vector2 } from './math/Vector2'

//materials
import { ShaderMaterial } from './materials/ShaderMaterial'

//geometries
import { BufferGeometry } from './geometries/BufferGeometry'

//camear
import { PerspectiveCamera } from './camera/PerspectiveCamera'
let THREE = {
    WebGLRenderer,

    WebGLUniforms,
    WebGLAttributes,

    Scene,
    Mesh,
    Object3D,

    Matrix4,
    Vector4,

    ShaderMaterial,

    BufferGeometry,

    PerspectiveCamera,
}
export { THREE }
