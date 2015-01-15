package net.geocentral.dicta.camel;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import net.geocentral.dicta.Dicta;
import net.geocentral.dicta.DictaStatusListener;

public class DictaWrapper implements DictaStatusListener {

    private Dicta model;
    private List<DictaStatusListener> statusListeners;

    public DictaWrapper() throws Exception {
        model = new Dicta();
        model.setStatusListener(this);
        statusListeners = new ArrayList<DictaStatusListener>();
    }
    
    public void setFileName(String fileName) throws Exception {
        Scanner scanner = new Scanner(new File(fileName));
        String text = scanner.useDelimiter("\\A").next();
        scanner.close();
        model.parse(text);
    }
    
    public Dicta getModel() {
        return model;
    }

    public void statusChanged(Map<String, Boolean> staleVarNames) throws Exception {
        for (DictaStatusListener statusListener : statusListeners) {
            statusListener.statusChanged(staleVarNames);
        }
    }

    public void addStatusListener(DictaStatusListener statusListener) {
        statusListeners.add(statusListener);
        
    }
}
