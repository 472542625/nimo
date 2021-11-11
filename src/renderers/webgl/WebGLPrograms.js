import { WebGLProgram } from './WebGLProgram'
class WebGLPrograms {
    constructor(renderer) {
        this.renderer = renderer
        this.programs = new Map()
    }
    getParameters(material) {
        const parameters = {
            vertexShader: material.vertexShader,
            fragmentShader: material.fragmentShader,
        }
        return parameters
    }
    getProgramCacheKey(parameters) {
        const array = []
        if (parameters.shaderID) {
            array.push(parameters.shaderID)
        } else {
            array.push(parameters.fragmentShader)
            array.push(parameters.vertexShader)
        }
        return array.join()
    }

    // 缓存program
    acquireProgram(material, programCacheKey) {
        let program = this.programs.get(programCacheKey)
        if (program === undefined) {
            program = new WebGLProgram(this.renderer, {
                vertexShader: material.vertexShader,
                fragmentShader: material.fragmentShader,
            }).program
            this.programs.set(programCacheKey, program)
        }
        return program
    }
}
export { WebGLPrograms }
