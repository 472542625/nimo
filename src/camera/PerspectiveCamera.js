import { Matrix4 } from '../math/Matrix4.js'
export class PerspectiveCamera {
    constructor(options) {
        this.projectionMatrix = new Matrix4().setPerspective(30, 1, 1, 100)
        this.viewMatrix = new Matrix4().lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)
    }
}
