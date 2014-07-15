package net.geocentral.dicta;

import java.io.FileReader;

import org.mozilla.javascript.tools.shell.Global;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class DictaTest {

    public static void main(String[] args) throws Exception {
        Context cx = Context.enter();
        Global global = new Global(cx);
        Scriptable argsObj = cx.newArray(global, new Object[] {});
        global.defineProperty("arguments", argsObj, ScriptableObject.DONTENUM);
        cx.evaluateReader(global, new FileReader("js/testJava.js"), null, 1, null);
    }
}
