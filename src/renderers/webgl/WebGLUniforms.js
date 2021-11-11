class WebGLUniforms {
    constructor() {}
    _createUniformSetters(gl, program) {
        let textureUnit = 0

        /**
         * Creates a setter for a uniform of the given program with it's
         * location embedded in the setter.
         * @param {WebGLProgram} program
         * @param {WebGLUniformInfo} uniformInfo
         * @returns {function} the created setter.
         */
        function createUniformSetter(program, uniformInfo) {
            const location = gl.getUniformLocation(program, uniformInfo.name)
            const type = uniformInfo.type
            // Check if this uniform is an array
            const isArray = uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]'
            if (type === gl.FLOAT && isArray) {
                return function (v) {
                    gl.uniform1fv(location, v)
                }
            }
            if (type === gl.FLOAT) {
                return function (v) {
                    gl.uniform1f(location, v)
                }
            }
            if (type === gl.FLOAT_VEC2) {
                return function (v) {
                    gl.uniform2fv(location, v)
                }
            }
            if (type === gl.FLOAT_VEC3) {
                return function (v) {
                    gl.uniform3fv(location, v)
                }
            }
            if (type === gl.FLOAT_VEC4) {
                return function (v) {
                    gl.uniform4fv(location, v)
                }
            }
            if (type === gl.INT && isArray) {
                return function (v) {
                    gl.uniform1iv(location, v)
                }
            }
            if (type === gl.INT) {
                return function (v) {
                    gl.uniform1i(location, v)
                }
            }
            if (type === gl.INT_VEC2) {
                return function (v) {
                    gl.uniform2iv(location, v)
                }
            }
            if (type === gl.INT_VEC3) {
                return function (v) {
                    gl.uniform3iv(location, v)
                }
            }
            if (type === gl.INT_VEC4) {
                return function (v) {
                    gl.uniform4iv(location, v)
                }
            }
            if (type === gl.BOOL) {
                return function (v) {
                    gl.uniform1iv(location, v)
                }
            }
            if (type === gl.BOOL_VEC2) {
                return function (v) {
                    gl.uniform2iv(location, v)
                }
            }
            if (type === gl.BOOL_VEC3) {
                return function (v) {
                    gl.uniform3iv(location, v)
                }
            }
            if (type === gl.BOOL_VEC4) {
                return function (v) {
                    gl.uniform4iv(location, v)
                }
            }
            if (type === gl.FLOAT_MAT2) {
                return function (v) {
                    gl.uniformMatrix2fv(location, false, v)
                }
            }
            if (type === gl.FLOAT_MAT3) {
                return function (v) {
                    gl.uniformMatrix3fv(location, false, v)
                }
            }
            if (type === gl.FLOAT_MAT4) {
                return function (v) {
                    gl.uniformMatrix4fv(location, false, v)
                }
            }
            if ((type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) && isArray) {
                const units = []
                for (let ii = 0; ii < info.size; ++ii) {
                    units.push(textureUnit++)
                }
                return (function (bindPoint, units) {
                    return function (textures) {
                        gl.uniform1iv(location, units)
                        textures.forEach(function (texture, index) {
                            gl.activeTexture(gl.TEXTURE0 + units[index])
                            gl.bindTexture(bindPoint, texture)
                        })
                    }
                })(getBindPointForSamplerType(gl, type), units)
            }
            if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) {
                return (function (bindPoint, unit) {
                    return function (texture) {
                        gl.uniform1i(location, unit)
                        gl.activeTexture(gl.TEXTURE0 + unit)
                        gl.bindTexture(bindPoint, texture)
                    }
                })(getBindPointForSamplerType(gl, type), textureUnit++)
            }
            throw 'unknown type: 0x' + type.toString(16) // we should never get here.
        }

        const uniformSetters = {}
        const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)

        for (let ii = 0; ii < numUniforms; ++ii) {
            const uniformInfo = gl.getActiveUniform(program, ii)
            if (!uniformInfo) {
                break
            }
            let name = uniformInfo.name
            // debugger
            // remove the array suffix.
            if (name.substr(-3) === '[0]') {
                name = name.substr(0, name.length - 3)
            }
            const setter = createUniformSetter(program, uniformInfo)
            uniformSetters[name] = setter
        }
        return uniformSetters
    }
    _setUniforms(setters, ...values) {
        setters = setters.uniformSetters || setters
        for (const uniforms of values) {
            Object.keys(uniforms).forEach(function (name) {
                const setter = setters[name]
                if (setter) {
                    setter(uniforms[name])
                }
            })
        }
    }
    // _setUniforms(object, program, gl) {
    //     const material = object.material
    //     const uniforms = material.uniforms
    //     for (const index in uniforms) {
    //         const uniform = uniforms[index]
    //         switch (uniform.type) {
    //             case 'vec4':
    //                 gl.uniform4fv(gl.getUniformLocation(program, index), uniform.value)
    //                 break
    //             case 'float':
    //                 gl.uniform1f(gl.getUniformLocation(program, index), uniform.value)
    //                 break
    //         }
    //     }
    // }
}
export { WebGLUniforms }
