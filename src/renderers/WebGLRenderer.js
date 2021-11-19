import { WebGLUniforms } from './webgl/WebGLUniforms'
import { WebGLAttributes } from './webgl/WebGLAttributes'
import { WebGLPrograms } from './webgl/WebGLPrograms'
import { WebGLProperties } from './webgl/WebGLProperties'
class WebGLRenderer {
    constructor(opt) {
        let _opt = opt || {}
        const { canvas = this._createCanvasElement() } = _opt
        this.domElement = canvas
        this.gl = this._getContext('webgl')
        this.programCache = new WebGLPrograms(this)
        this.properties = new WebGLProperties()
    }
    _createCanvasElement() {
        const canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas')
        canvas.style.display = 'block'
        return canvas
    }
    _getContext(contextName) {
        const context = this.domElement.getContext(contextName)
        if (context !== null) return context
        return null
    }
    render(scene, camera) {
        const gl = this.gl
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        // 隐藏面消除，默认只显示顶点顺序逆时针的三角面
        gl.enable(gl.CULL_FACE)
        gl.enable(gl.DEPTH_TEST)
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        // Clear the canvas AND the depth buffer.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        // TODO sort scene mesh
        this._renderObjects(scene, camera)
    }

    _renderObjects(scene, camera) {
        let children = scene.children
        for (const object of children) {
            this._renderBufferDirect(camera, object)
        }
    }

    _renderBufferDirect(camera, object) {
        const gl = this.gl
        const program = this._setProgram(camera, object)
        // TODO
        //state.setMaterial( material, frontFaceCW );//主要根据material里面的有关于测试相关的信息写入，如深度检测，深度写等等

        // bind attributes
        // TODO webgl2 VAO
        const webglAttributes = new WebGLAttributes()
        const attribSetters = webglAttributes._createAttributeSetters(gl, program)
        webglAttributes._setBuffersAndAttributes(gl, attribSetters, object.geometry)

        // gl.drawArrays(gl.TRIANGLES, 0, object.geometry.numElements)
        gl.drawElements(gl.TRIANGLES, object.geometry.numElements, gl.UNSIGNED_BYTE, 0)

        // three    renderBufferDirect逻辑
        // const program = setProgram( camera, scene, material, object );// 设置uniforms
        // state.setMaterial( material, frontFaceCW ); // 根据material设置渲染状态，如深度测试等等
        // let index = geometry.index;
        // const position = geometry.attributes.position
        // bindingStates.setup( object, material, program, geometry, index ); // 传入attributes
        // let renderer  =bufferRenderer/indexedBufferRenderer
        // renderer.setMode( _gl.TRIANGLES )// 点线面
        // gl.drawArrays(gl.TRIANGLES, 0, n)
    }

    _setProgram(camera, object) {
        const gl = this.gl
        let material = object.material
        let programCache = this.programCache
        let parameters = programCache.getParameters(material)
        let programCacheKey = programCache.getProgramCacheKey(parameters)
        let program = programCache.acquireProgram(material, programCacheKey)

        // add mvp
        material.uniforms.projectionMatrix = camera.projectionMatrix.elements
        material.uniforms.viewMatrix = camera.viewMatrix.elements
        material.uniforms.modelMatrix = object.matrixWorld.elements

        const webglUniforms = new WebGLUniforms()
        const uniformSetters = webglUniforms._createUniformSetters(gl, program)
        webglUniforms._setUniforms(uniformSetters, material.uniforms)

        // TODO 判断program是否和上一个一致，一致就不需要gl.useProgram // state.useProgram( program.program )
        gl.useProgram(program)
        return program
    }

    // _setProgram2(camera, object) {
    //     let material = object.material
    //     let properties = this.properties
    //     let materialProperties = properties.get(material) // new material is {}
    //     let needsProgramChange = false
    //     if (material.version === materialProperties.__version) {
    //     } else {
    //         needsProgramChange = true
    //         materialProperties.__version = material.version
    //     }
    //     let program = materialProperties.currentProgram
    //     if (needsProgramChange === true) {
    //         program = this._getProgram(material, scene, object)
    //     }
    //     // TODO 判断program是否和上一个一致，一致就不需要gl.useProgram // state.useProgram( program.program )
    //     gl.useProgram(program)
    //     return program
    // }

    // _getProgram(object) {
    //     let material = object.material
    //     let properties = this.properties
    //     let programCache = this.programCache
    //     let materialProperties = properties.get(material)
    //     let parameters = programCache.getParameters(material)
    //     let programCacheKey = programCache.getProgramCacheKey(parameters)
    //     let programs = materialProperties.programs
    //     if (programs === undefined) {
    //         // // new material
    //         // material.addEventListener('dispose', onMaterialDispose)
    //         programs = new Map()
    //         materialProperties.programs = programs
    //     }
    //     let program = programs.get(programCacheKey)
    //     if (program !== undefined) {
    //         return program
    //     } else {
    //         parameters.uniforms = material.uniforms
    //         program = programCache.acquireProgram(parameters, programCacheKey)
    //         programs.set(programCacheKey, program)
    //         materialProperties.uniforms = parameters.uniforms
    //     }
    //     const uniforms = materialProperties.uniforms
    // }
}
export { WebGLRenderer }
