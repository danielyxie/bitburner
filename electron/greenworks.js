// Copyright (c) 2015 Greenheart Games Pty. Ltd. All rights reserved.
// Use of this source code is governed by the MIT license that can be
// found in the LICENSE file.

// The source code can be found in https://github.com/greenheartgames/greenworks
var fs = require('fs');

var greenworks;

if (process.platform == 'darwin') {
  if (process.arch == 'x64')
    greenworks = require('./lib/greenworks-osx64');
  else if (process.arch == 'ia32')
    greenworks = require('./lib/greenworks-osx32');
} else if (process.platform == 'win32') {
  if (process.arch == 'x64')
    greenworks = require('./lib/greenworks-win64');
  else if (process.arch == 'ia32')
    greenworks = require('./lib/greenworks-win32');
} else if (process.platform == 'linux') {
  if (process.arch == 'x64')
    greenworks = require('./lib/greenworks-linux64');
  else if (process.arch == 'ia32')
    greenworks = require('./lib/greenworks-linux32');
}

function error_process(err, error_callback) {
  if (err && error_callback)
    error_callback(err);
}

greenworks.ugcGetItems = function(options, ugc_matching_type, ugc_query_type,
    success_callback, error_callback) {
  if (typeof options !== 'object') {
    error_callback = success_callback;
    success_callback = ugc_query_type;
    ugc_query_type = ugc_matching_type;
    ugc_matching_type = options;
    options = {
      'app_id': greenworks.getAppId(),
      'page_num': 1
    }
  }
  greenworks._ugcGetItems(options, ugc_matching_type, ugc_query_type,
      success_callback, error_callback);
}

greenworks.ugcGetUserItems = function(options, ugc_matching_type,
    ugc_list_sort_order, ugc_list, success_callback, error_callback) {
  if (typeof options !== 'object') {
    error_callback = success_callback;
    success_callback = ugc_list;
    ugc_list = ugc_list_sort_order;
    ugc_list_sort_order = ugc_matching_type;
    ugc_matching_type = options;
    options = {
      'app_id': greenworks.getAppId(),
      'page_num': 1
    }
  }
  greenworks._ugcGetUserItems(options, ugc_matching_type, ugc_list_sort_order,
      ugc_list, success_callback, error_callback);
}

greenworks.ugcSynchronizeItems = function (options, sync_dir, success_callback,
    error_callback) {
  if (typeof options !== 'object') {
    error_callback = success_callback;
    success_callback = sync_dir;
    sync_dir = options;
    options = {
      'app_id': greenworks.getAppId(),
      'page_num': 1
    }
  }
  greenworks._ugcSynchronizeItems(options, sync_dir, success_callback,
      error_callback);
}

greenworks.publishWorkshopFile = function(options, file_path, image_path, title,
    description, success_callback, error_callback) {
  if (typeof options !== 'object') {
    error_callback = success_callback;
    success_callback = description;
    description = title;
    title = image_path;
    image_path = file_path;
    file_path = options;
    options = {
      'app_id': greenworks.getAppId(),
      'tags': []
    }
  }
  greenworks._publishWorkshopFile(options, file_path, image_path, title,
      description, success_callback, error_callback);
}

greenworks.updatePublishedWorkshopFile = function(options,
    published_file_handle, file_path, image_path, title, description,
    success_callback, error_callback) {
  if (typeof options !== 'object') {
    error_callback = success_callback;
    success_callback = description;
    description = title;
    title = image_path;
    image_path = file_path;
    file_path = published_file_handle;
    published_file_handle = options;
    options = {
      'tags': [] // No tags are set
    }
  }
  greenworks._updatePublishedWorkshopFile(options, published_file_handle,
     file_path, image_path, title, description, success_callback,
     error_callback);
}

// An utility function for publish related APIs.
// It processes remains steps after saving files to Steam Cloud.
function file_share_process(file_name, image_name, next_process_func,
    error_callback, progress_callback) {
  if (progress_callback)
    progress_callback("Completed on saving files on Steam Cloud.");
  greenworks.fileShare(file_name, function() {
    greenworks.fileShare(image_name, function() {
      next_process_func();
    }, function(err) { error_process(err, error_callback); });
  }, function(err) { error_process(err, error_callback); });
}

// Publishing user generated content(ugc) to Steam contains following steps:
// 1. Save file and image to Steam Cloud.
// 2. Share the file and image.
// 3. publish the file to workshop.
greenworks.ugcPublish = function(file_name, title, description, image_name,
    success_callback, error_callback, progress_callback) {
  var publish_file_process = function() {
    if (progress_callback)
      progress_callback("Completed on sharing files.");
    greenworks.publishWorkshopFile(file_name, image_name, title, description,
        function(publish_file_id) { success_callback(publish_file_id); },
        function(err) { error_process(err, error_callback); });
  };
  greenworks.saveFilesToCloud([file_name, image_name], function() {
    file_share_process(file_name, image_name, publish_file_process,
        error_callback, progress_callback);
  }, function(err) { error_process(err, error_callback); });
}

// Update publish ugc steps:
// 1. Save new file and image to Steam Cloud.
// 2. Share file and images.
// 3. Update published file.
greenworks.ugcPublishUpdate = function(published_file_id, file_name, title,
    description, image_name, success_callback, error_callback,
    progress_callback) {
  var update_published_file_process = function() {
    if (progress_callback)
      progress_callback("Completed on sharing files.");
    greenworks.updatePublishedWorkshopFile(published_file_id,
        file_name, image_name, title, description,
        function() { success_callback(); },
        function(err) { error_process(err, error_callback); });
  };

  greenworks.saveFilesToCloud([file_name, image_name], function() {
    file_share_process(file_name, image_name, update_published_file_process,
        error_callback, progress_callback);
  }, function(err) { error_process(err, error_callback); });
}

// Greenworks Utils APIs implmentation.
greenworks.Utils.move = function(source_dir, target_dir, success_callback,
    error_callback) {
  fs.rename(source_dir, target_dir, function(err) {
    if (err) {
      if (error_callback) error_callback(err);
      return;
    }
    if (success_callback)
      success_callback();
  });
}

greenworks.init = function() {
  if (this.initAPI()) return true;
  if (!this.isSteamRunning())
    throw new Error("Steam initialization failed. Steam is not running.");
  var appId;
  try {
    appId = fs.readFileSync('steam_appid.txt', 'utf8');
  } catch (e) {
    throw new Error("Steam initialization failed. Steam is running," +
                    "but steam_appid.txt is missing. Expected to find it in: " +
                    require('path').resolve('steam_appid.txt'));
  }
  if (!/^\d+ *\r?\n?$/.test(appId)) {
    throw new Error("Steam initialization failed. " +
                    "steam_appid.txt appears to be invalid; " +
                    "it should contain a numeric ID: " + appId);
  }
  throw new Error("Steam initialization failed, but Steam is running, " +
                  "and steam_appid.txt is present and valid." +
                  "Maybe that's not really YOUR app ID? " + appId.trim());
}

var EventEmitter = require('events').EventEmitter;
greenworks.__proto__ = EventEmitter.prototype;
EventEmitter.call(greenworks);

greenworks._steam_events.on = function () {
  greenworks.emit.apply(greenworks, arguments);
};

process.versions['greenworks'] = greenworks._version;

module.exports = greenworks;
