import { Object3D } from '../core/Object3D.js'

class Scene extends Object3D {
    constructor() {
        super()
        this.type = 'Scene'
        // this.background = null;
        // this.environment = null;
        // this.fog = null;
        // this.overrideMaterial = null;
        // this.autoUpdate = true; // checked by the renderer
    }
}

Scene.prototype.isScene = true

export { Scene }
