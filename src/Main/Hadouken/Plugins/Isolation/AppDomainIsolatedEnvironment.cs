﻿using System;
using Hadouken.Fx;

namespace Hadouken.Plugins.Isolation
{
    public class AppDomainIsolatedEnvironment : IIsolatedEnvironment
    {
        private readonly string _baseDirectory;
        private Sandbox _sandbox;

        public AppDomainIsolatedEnvironment(string baseDirectory)
        {
            _baseDirectory = baseDirectory;
        }

        public void Load(PluginConfiguration configuration)
        {
            _sandbox = Sandbox.Create(_baseDirectory);

            try
            {
                _sandbox.Load(configuration);
            }
            catch (Exception)
            {
                var domain = _sandbox.GetAppDomain();
                AppDomain.Unload(domain);

                _sandbox = null;

                throw;
            }
        }

        public void Unload()
        {
            if (_sandbox == null)
            {
                return;
            }

            _sandbox.Unload();

            var domain = _sandbox.GetAppDomain();
            AppDomain.Unload(domain);
            _sandbox = null;
        }

        public long GetMemoryUsage()
        {
            if (_sandbox == null)
            {
                return -1;
            }

            return _sandbox.GetAppDomain().MonitoringSurvivedMemorySize;
        }
    }
}