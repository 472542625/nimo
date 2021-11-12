import { Matrix4 } from '../math/Matrix4'
class Object3D {
    constructor(opt) {
        let _opt = opt || {}
        const { name = '', type = 'Object3D' } = _opt
        this.name = name
        this.type = type
        this.children = []
        this.matrixWorld = new Matrix4()
    }
    add(object) {
        this.children.push(object)
    }
    rotateX(angle) {
        this.matrixWorld.rotate(angle, 1, 0, 0)
    }
    rotateY(angle) {
        this.matrixWorld.rotate(angle, 0, 1, 0)
    }
    rotateZ(angle) {
        this.matrixWorld.rotate(angle, 0, 0, 1)
    }
}
export { Object3D }
