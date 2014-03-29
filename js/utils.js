var WebGL = function(){
    if(arguments.length ===0) return null;
    var canvas=document.getElementById(arguments[0]),
        contextNames = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"]
        gl = null,
        program=null,
        vShader=null,
        fShader=null,

        this.log = function(){
            for(var z in arguments){
                console.log(arguments[z]);
            }
        },
        this.dir = function(){
            for(var z in arguments){
                console.dir(arguments[z]);
            }
        },
        this.setGL = function(){
            for(var names in contextNames){
                try{
                    gl = canvas.getContext(contextNames[names]);
                    if(gl){
                        break;
                    }
                } catch (e){
                    this.log(e);
                }
            }
            if(!gl){
                this.log("WebGL not available");
            } else {
                this.log("WebGL context successfully initialized");
            }
        },
        this.getGL = function(){
            return gl;
        },
        this.setShader = function(){

        }
        ;

        this.setGL();
}
