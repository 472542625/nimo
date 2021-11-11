class WebGLAttributes {
    constructor() {}
    _createAttributeSetters(gl, program) {
        const attribSetters = {}

        function createAttribSetter(index) {
            return function (b) {
                if (b.value) {
                    gl.disableVertexAttribArray(index)
                    switch (b.value.length) {
                        case 4:
                            gl.vertexAttrib4fv(index, b.value)
                            break
                        case 3:
                            gl.vertexAttrib3fv(index, b.value)
                            break
                        case 2:
                            gl.vertexAttrib2fv(index, b.value)
                            break
                        case 1:
                            gl.vertexAttrib1fv(index, b.value)
                            break
                        default:
                            throw new Error('the length of a float constant value must be between 1 and 4!')
                    }
                } else {
                    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer)
                    gl.enableVertexAttribArray(index)
                    gl.vertexAttribPointer(index, b.numComponents || b.size, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0)
                }
            }
        }

        const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
        for (let ii = 0; ii < numAttribs; ++ii) {
            const attribInfo = gl.getActiveAttrib(program, ii)
            if (!attribInfo) {
                break
            }
            const index = gl.getAttribLocation(program, attribInfo.name)
            attribSetters[attribInfo.name] = createAttribSetter(index)
        }

        return attribSetters
    }

    _setBuffersAndAttributes(gl, setters, buffers) {
        this._setAttributes(setters, buffers.attribs)
        if (buffers.indices) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)
        }
    }

    _setAttributes(setters, attribs) {
        setters = setters.attribSetters || setters
        Object.keys(attribs).forEach(function (name) {
            const setter = setters[name]
            if (setter) {
                setter(attribs[name])
            }
        })
    }
}
export { WebGLAttributes }
