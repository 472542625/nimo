class WebGLProgram {
    constructor(renderer, parameters) {
        const gl = renderer.gl
        let vertexShader = parameters.vertexShader
        let fragmentShader = parameters.fragmentShader
        this.program = this.createProgram(gl, vertexShader, fragmentShader)
    }

    createProgram(gl, vshader, fshader) {
        // Create shader object
        const vertexShader = this._loadShader(gl, gl.VERTEX_SHADER, vshader)
        const fragmentShader = this._loadShader(gl, gl.FRAGMENT_SHADER, fshader)
        if (!vertexShader || !fragmentShader) {
            return null
        }

        // Create a program object
        const program = gl.createProgram()
        if (!program) {
            return null
        }

        // Attach the shader objects
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)

        // Link the program object
        gl.linkProgram(program)

        // Check the result of linking
        const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
        if (!linked) {
            const error = gl.getProgramInfoLog(program)
            console.log('Failed to link program: ' + error)
            gl.deleteProgram(program)
            gl.deleteShader(fragmentShader)
            gl.deleteShader(vertexShader)
            return null
        }
        gl.deleteShader(fragmentShader)
        gl.deleteShader(vertexShader)
        return program
    }

    _loadShader(gl, type, source) {
        // Create shader object
        const shader = gl.createShader(type)
        if (shader == null) {
            console.log('unable to create shader')
            return null
        }

        // Set the shader program
        gl.shaderSource(shader, source)

        // Compile the shader
        gl.compileShader(shader)

        // Check the result of compilation
        const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        if (!compiled) {
            const error = gl.getShaderInfoLog(shader)
            console.log('Failed to compile shader: ' + error)
            gl.deleteShader(shader)
            return null
        }

        return shader
    }

    //

    _fetchAttributeLocations(gl, program) {
        const attributes = {}

        const n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)

        for (let i = 0; i < n; i++) {
            const info = gl.getActiveAttrib(program, i)
            const name = info.name

            // console.log( 'THREE.WebGLProgram: ACTIVE VERTEX ATTRIBUTE:', name, i );

            attributes[name] = gl.getAttribLocation(program, name)
        }

        return attributes
    }

    _getAttributes = function () {
        if (this.cachedAttributes === undefined) {
            this.cachedAttributes = this._fetchAttributeLocations(gl, program)
        }

        return this.cachedAttributes
    }
}
export { WebGLProgram }
