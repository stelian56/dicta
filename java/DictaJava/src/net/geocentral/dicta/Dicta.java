package net.geocentral.dicta;

import java.io.FileReader;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeJavaObject;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.tools.shell.Global;

public class Dicta {

    private Context cx;
    private Global scope;
    private Function parseFunc;
    private Function getFunc;
    private Function setFunc;
    private Function setStatusListenerFunc;
    private Function watchFunc;
    private Function addFunctionFunc;
    
    public Dicta() throws Exception {
        cx = Context.enter();
        scope = new Global(cx);
        Scriptable argsObj = cx.newArray(scope, new Object[] {});
        scope.defineProperty("arguments", argsObj, ScriptableObject.DONTENUM);
        Script script = cx.compileReader(new FileReader("js/queryJava.js"), null, 1, null);
        script.exec(cx, scope);
        parseFunc = (Function)scope.get("parse", scope);
        getFunc = (Function)scope.get("get", scope);
        setFunc = (Function)scope.get("set", scope);
        setStatusListenerFunc = (Function)scope.get("setStatusListener", scope);
        watchFunc = (Function)scope.get("watch", scope);
        addFunctionFunc = (Function)scope.get("addFunction", scope);
    }
    
    public void parse(String text) {
        cx = Context.enter();
        Object functionArgs[] = { text };
        Object result = parseFunc.call(cx,  scope, null, functionArgs);
        System.out.println(result);
    }

    public Object get(String varName) {
        cx = Context.enter();
        Object functionArgs[] = { varName };
        Object result = getFunc.call(cx, scope, null, functionArgs);
        return result instanceof NativeJavaObject ? ((NativeJavaObject)result).unwrap() : result;
    }

    public void set(String varName, Object value) {
        cx = Context.enter();
        Object functionArgs[] = { varName, value };
        setFunc.call(cx, scope, null, functionArgs);
    }

    public void setStatusListener(DictaStatusListener statusListener) {
        cx = Context.enter();
        Object functionArgs[] = { statusListener, "statusChanged" };
        setStatusListenerFunc.call(cx, scope, null, functionArgs);
    }

    public void Watch(String varName) {
        cx = Context.enter();
        Object functionArgs[] = { varName };
        watchFunc.call(cx, scope, null, functionArgs);
    }

    public void addFunction(String name, Object owner, String methodName) {
        cx = Context.enter();
        Object functionArgs[] = { name, owner, methodName };
        addFunctionFunc.call(cx, scope, null, functionArgs);
    }
}
