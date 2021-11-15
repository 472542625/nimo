import { Matrix4 } from '../math/Matrix4'
import { Vector3 } from '../math/Vector3'
class Object3D {
    constructor() {
        this.name = ''
        this.type = 'Object3D'
        this.children = []
        this.matrixWorld = new Matrix4()
        this.position = new Vector3()
    }

    add(object) {
        this.children.push(object)
        object.parent = this
    }

    remove(object) {
        const index = this.children.indexOf(object)
        if (index !== -1) {
            object.parent = null
            this.children.splice(index, 1)
        }
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

    translateX(distance) {
        return this.matrixWorld.translate(distance, 0, 0)
    }

    translateY(distance) {
        return this.matrixWorld.translate(0, distance, 0)
    }

    translateZ(distance) {
        return this.matrixWorld.translate(0, 0, distance)
    }

    lookAt(x, y, z) {}
}
export { Object3D }
