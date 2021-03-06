﻿using EdgeJs;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DictaDotNet
{
    public class Dicta
    {
        IDictaStatusListener statusListener;
        private Func<object, Task<object>> edge;
        private List<string> staleVarNames = new List<string>();

        public Dicta()
        {
            string queryScript = File.ReadAllText(@".\edge\js\queryDotNet.func");
            edge = Edge.Func(queryScript);
        }

        public void Parse(string text)
        {
            try
            {
                var args = new
                {
                    query = "parse",
                    text = text
                };
                var result = edge(args).Result;
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.InnerException.Message);
            }
        }

        public object Get(string varName)
        {
            try
            {
                var args = new
                {
                    query = "get",
                    varName = varName
                };
                return edge(args).Result;
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.InnerException.Message);
                return null;
            }
        }

        public void Set(string varName, object value)
        {
            try
            {
                var args = new
                {
                    query = "set",
                    varName = varName,
                    varValue = value
                };
                var result = edge(args).Result;
                if (statusListener != null)
                {
                    statusListener.StatusChanged(staleVarNames.ToArray());
                    staleVarNames.Clear();
                }
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.InnerException.Message);
            }
        }

        public void SetStatusListener(IDictaStatusListener statusListener)
        {
            this.statusListener = statusListener;
            Func<object, object> action = ((dynamic varNames) =>
            {
                foreach (dynamic keyValue in varNames)
                {
                    this.staleVarNames.Add(keyValue.Key);
                };
                return true;
            });

            var statusChanged = (Func<object, Task<object>>)((dynamic varNames) =>
            {
                Task<object> t = new Task<object>(action, varNames);
                t.Start();
                t.Wait();
                return t;
            });
            try
            {
                object args = new
                {
                    query = "setStatusListener",
                    statusChanged = statusChanged
                };
                var result = edge(args).Result;
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.InnerException.Message);
            }
        }

        public void Watch(string varName)
        {
            var args = new {
                query = "watch",
                varName = varName
            };
            try
            {
                var result = edge(args).Result;
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.InnerException.Message);
            }
        }

        public void AddFunction(string name, Func<object, object> action)
        {
            AddFunction(name, action, false);
        }

        public void AddFunction(string name, Func<object, object> action, bool asynchronous)
        {
            var func = (Func<object, Task<object>>)((dynamic parameters) =>
            {
                Task<object> t = new Task<object>(action, parameters);
                t.Start();
                if (!asynchronous)
                {
                    t.Wait();
                }
                return t;
            });
            try
            {
                object args = new
                {
                    query = "addFunction",
                    name = name,
                    func  = func
                };
                var result = edge(args).Result;
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.InnerException.Message);
            }
        }
    }
}
