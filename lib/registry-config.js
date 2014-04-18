var extend = require('util')._extend;
var storage = require('./storage');

exports = module.exports = RegistryConfig;

var TRACKED_OPTIONS = [
  'registry',
  'username',
  'email',
  'proxy',
  'https-proxy',
  'local-address',
  'strict-ssl',
  'always-auth',
  '_auth',
  '_token',
];

/**
 * Creates a new instance of registry object.
 * @param {Object} config Registry configuration (url, username, etc.)
 * @constructor
 */
function RegistryConfig(config) {
  copyTrackedOptions(config, this);
}

/**
 * Create a default registry.
 * @param {string} npmRcPath Path to ~/.npmrc file with user's default settings
 * @returns {RegistryConfig}
 */
RegistryConfig.createDefault = function(npmRcPath) {
  var npmrc = storage.tryReadIniFile(npmRcPath, {});

  var config = extend(
    { registry: RegistryConfig.getDefaultUrl() },
    npmrc);

  return new RegistryConfig(config);
};

RegistryConfig.getDefaultUrl = function() {
  // TODO(bajtos) load the default registry URL from system and built-in npmrc
  return 'https://registry.npmjs.org/';
};

/**
 * Apply current configuration to npmrc
 * @param {Object} npmrc
 */
RegistryConfig.prototype.applyTo = function(npmrc) {
  copyTrackedOptions(this, npmrc);
};

/**
 * Update tracked options to the values in npmrc
 * @param {Object} npmrc
 */
RegistryConfig.prototype.updateFrom = function(npmrc) {
  copyTrackedOptions(npmrc, this, ['registry']);
};

function copyTrackedOptions(src, dst, excluding) {
  TRACKED_OPTIONS.forEach(function(k) {
    if (excluding && excluding.indexOf(k) !== -1) return;

    var value = src[k];
    if (value == null)
      delete dst[k];
    else
      dst[k] = src[k];
  });
}