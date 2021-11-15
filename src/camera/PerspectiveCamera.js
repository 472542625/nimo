import { Object3D } from '../core/Object3D.js'
import { Matrix4 } from '../math/Matrix4.js'
export class PerspectiveCamera extends Object3D {
    constructor(fov = 50, aspect = 1, near = 0.1, far = 2000) {
        super()
        this.type = 'Camera'
        this.fov = fov
        this.aspect = aspect
        this.near = near
        this.far = far
        this.projectionMatrix = new Matrix4()
        this.viewMatrix = new Matrix4()
        this.updateProjectionMatrix()
    }

    updateProjectionMatrix() {
        this.projectionMatrix.setPerspective(this.fov, this.aspect, this.near, this.far)
    }

    lookAt(x, y, z) {
        this.viewMatrix = new Matrix4().lookAt(this.position.x, this.position.y, this.position.z, x, y, z, 0, 1, 0)
    }
}
