#!/usr/bin/env python
# -*- coding: utf-8

import os
import shutil

RESULT_FILE = "sci-widgets.js"

MODULES_PREINSTALL = {
    "core/SciWidget": "modules/core",
    "core/SciScrollable": "modules/core",
    "core/SciWindow": "modules/core"
}

CLASS_MAP = {
    "lists/SciTree": "sci-tree",
    "lists/SciTreeNode": "sci-tree-node",
    "server/SciProgressBar": "sci-progress-bar",
    "core/SciWindow": "SciWindow",
    "server/SciUpload": "sci-upload",
    "server/SciPhotoUpload": "sci-photo-upload",
    "buttons/SciRadioButton": "sci-radio-button",
    "edit-boxes/SciSpin": "sci-spin",
    "edit-boxes/SciSpinInput": "sci-spin-input",
    "core/SciWidget": "SciWidget",
    "core/SciScrollable": "SciScrollable"
}


def module_modification_time(source_dir, mtime=None):
    if mtime is None:
        mtime = []

    for filename in os.listdir(source_dir):
        fullname = os.path.join(source_dir, filename)
        if os.path.isfile(fullname):
            t = os.stat(fullname).st_mtime
            mtime.append(t)
        if os.path.isdir(fullname):
            module_modification_time(fullname, mtime)

    return max(mtime)


def install_package(name):
    fullname = os.path.join("src", name)
    target_path = os.path.join("modules", name)
    for class_name in os.listdir(fullname):
        source_name = os.path.join(name, class_name)
        if source_name not in MODULES_PREINSTALL:
            install_module(source_name, target_path)
    return target_path


def install_module(source_name, target_path):
    source_folder = os.path.join("src", source_name)
    element_name = CLASS_MAP[source_name]
    target_file = os.path.join(target_path, element_name+".js")
    source_mtime = module_modification_time(source_folder)
    try:
        target_mtime = os.stat(target_file).st_mtime
    except OSError:
        target_mtime = 0
    if source_mtime > target_mtime:
        os.system("node minify-all.js %s %s" % (source_name, element_name))
    else:
        print("Ignored %s: the module version is up to date" % source_name)
    with open(target_file) as f1:
        target_content = f1.read()
    f.write(target_content)


if __name__ == "__main__":
    t1 = os.stat("src/common-styles.css").st_mtime
    try:
        t2 = os.stat("modules/common.js").st_mtime
    except OSError:
        t2 = 0
    if t1 > t2:
        os.system("node minify-basics.js")
    else:
        print("Ignoring: common styles and constants have already been minified")
    shutil.copyfile("modules/common.js", RESULT_FILE)
    f = open(RESULT_FILE, "a")

    for source_name, target_path in MODULES_PREINSTALL.items():
        install_module(source_name, target_path)

    for package_dir in os.listdir("src"):
        full_package_dir = os.path.join("src", package_dir)
        if os.path.isdir(full_package_dir):
            install_package(package_dir)

    f.close()
