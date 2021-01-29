#!/usr/bin/env python
# -*- coding: utf-8

import os


CLASS_MAP = {
    "SciTree": "sci-tree",
    "SciTreeNode": "sci-tree-node",
    "SciProgressBar": "sci-progress-bar",
    "SciWindow": "sci-window",
    "SciUpload": "sci-upload",
    "SciPhotoUpload": "sci-photo-upload",
    "SciRadioButton": "sci-radio-button"
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
        element_name = CLASS_MAP[class_name]
        target_file = os.path.join(target_path, element_name+".js")
        source_folder = os.path.join(fullname, class_name)
        source_name = os.path.join(name, class_name)
        source_mtime = module_modification_time(source_folder)
        try:
            target_mtime = os.stat(target_file).st_mtime
        except OSError:
            target_mtime = 0
        if source_mtime > target_mtime:
            os.system("node compile.js %s %s" % (source_name, element_name))
        else:
            print("Ignored %s: the module version is up to date" % source_name)


for package_dir in os.listdir("src"):
    full_package_dir = os.path.join("src", package_dir)
    if os.path.isdir(full_package_dir):
        install_package(package_dir)
