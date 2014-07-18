package net.geocentral.dicta.test;

import java.io.FileReader;

import org.junit.Before;
import org.junit.Test;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.tools.shell.Global;

public class CoreTest {

    private Context cx;
    private Global scope;
    
    @Before
    public void setUp() throws Exception {
        cx = Context.enter();
        scope = new Global(cx);
        String text = "console = { log: print, info: print, warn: print, error: print }";
        cx.evaluateString(scope, text, null, 1, null);
    }

    @Test
    public void testCore() throws Exception {
        System.out.println("\n***\ntestCore");
        Scriptable argsObj = cx.newArray(scope, new Object[] {});
        scope.defineProperty("arguments", argsObj, ScriptableObject.DONTENUM);
        cx.evaluateReader(scope, new FileReader("js/test/java/testCoreJava.js"), null, 1, null);
    }
}
