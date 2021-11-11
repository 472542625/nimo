class Object3D {
    constructor(opt) {
        let _opt = opt || {}
        const { name = '', type = 'Object3D' } = _opt
        this.name = name
        this.type = type
        this.children = []
    }
    add(object) {
        this.children.push(object)
    }
}
export { Object3D }
