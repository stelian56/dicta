package net.geocentral.dicta;

import java.io.FileReader;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeJavaObject;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.tools.shell.Global;

public class DictaModel {

    private Context cx;
    private Global scope;
    
    public DictaModel() throws Exception {
        cx = Context.enter();
        scope = new Global(cx);
        Scriptable argsObj = cx.newArray(scope, new Object[] {});
        scope.defineProperty("arguments", argsObj, ScriptableObject.DONTENUM);
        cx.evaluateReader(scope, new FileReader("js/queryJava.js"), null, 1, null);
    }
    
    public void parse(String text) {
        Function f = (Function)scope.get("parse", scope);
        Object functionArgs[] = { text };
        Object result = f.call(cx,  scope, scope, functionArgs);
        System.out.println(result);
    }

    public Object get(String varName) {
        Function f = (Function)scope.get("get", scope);
        Object functionArgs[] = { varName };
        Object result = f.call(cx, scope, scope, functionArgs);
        return result instanceof NativeJavaObject ? ((NativeJavaObject)result).unwrap() : result;
    }

    public void set(String varName, Object value) {
        Function f = (Function)scope.get("set", scope);
        Object functionArgs[] = { varName, value };
        f.call(cx, scope, scope, functionArgs);
    }

    public void AddFunction(String name, Object owner, String methodName) {
        scope.defineProperty(name, owner, ScriptableObject.CONST);
        Function f = (Function)scope.get("addFunction", scope);
        Object functionArgs[] = { name, owner, methodName };
        f.call(cx, scope, scope, functionArgs);
    }

    
}
