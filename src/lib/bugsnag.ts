import React from 'react'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'

Bugsnag.start({
  apiKey: process.env.BUGSNAG_KEY || '7bf586baa26d4d454069c96573fa0b08',
  plugins: [new BugsnagPluginReact(React)]
});

export default Bugsnag;
