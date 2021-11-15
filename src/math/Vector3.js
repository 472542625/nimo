export class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }

    set(x, y, z) {
        if (z === undefined) z = this.z // sprite.scale.set(x,y)

        this.x = x
        this.y = y
        this.z = z

        return this
    }
}
