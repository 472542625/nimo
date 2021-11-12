import { WebGLUniforms } from './webgl/WebGLUniforms'
import { WebGLAttributes } from './webgl/WebGLAttributes'
import { WebGLPrograms } from './webgl/WebGLPrograms'
import { Matrix4 } from '../math/Matrix4'
class WebGLRenderer {
    constructor(opt) {
        let _opt = opt || {}
        const { canvas = this._createCanvasElement() } = _opt
        this.domElement = canvas
        this.gl = this._getContext('webgl')
        this.programCache = new WebGLPrograms(this)

        this.mvpMatrix = new Matrix4()
        this.mvpMatrix.setPerspective(30, 1, 1, 100)
        this.mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)
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
        let children = scene.children

        // TODO sort scene mesh
        this._renderObjects(children)
    }

    _renderObjects(children) {
        for (const object of children) {
            this._renderBufferDirect(object)
        }
    }

    _renderBufferDirect(object) {
        const gl = this.gl
        const material = object.material
        const program = this._setProgram(object)
        // TODO 判断program是否和上一个一致，一致就不需要gl.useProgram // state.useProgram( program.program )
        gl.useProgram(program)

        // add mvp
        material.uniforms.u_MvpMatrix = this.mvpMatrix.elements

        const webglUniforms = new WebGLUniforms()
        const uniformSetters = webglUniforms._createUniformSetters(gl, program)

        const webglAttributes = new WebGLAttributes()
        const attribSetters = webglAttributes._createAttributeSetters(gl, program)
        webglAttributes._setBuffersAndAttributes(gl, attribSetters, object.geometry)
        webglUniforms._setUniforms(uniformSetters, material.uniforms)

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

    _setProgram(object) {
        const material = object.material
        const programCache = this.programCache
        const parameters = programCache.getParameters(material)
        const programCacheKey = programCache.getProgramCacheKey(parameters)
        const program = programCache.acquireProgram(material, programCacheKey)
        return program
    }
}
export { WebGLRenderer }
