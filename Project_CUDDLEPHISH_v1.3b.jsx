(function (thisObj) {
  var CUDDLEPHISH_VERSION = "Project CuddlePhish v1.3b";
  var CuddlePhish = new Object();
  //default variables
  CuddlePhish.giffps = 24;
  CuddlePhish.gifmem = 1500;
  CuddlePhish.giffuzz = 100;
  CuddlePhish.gifwidth = 970;
  CuddlePhish.wideortall = 0;
  CuddlePhish.gifdithersetting = 0;

  CuddlePhish.fpsfromcomp = true;
  CuddlePhish.widthfromcomp = true;

  CuddlePhish.turboMode = false;

  //load defaults from user prefs
  if (app.settings.haveSetting("cuddlephish", "framerate")) {
    CuddlePhish.giffps = parseInt(
      app.settings.getSetting("cuddlephish", "framerate")
    );
  }
  if (app.settings.haveSetting("cuddlephish", "memoryLimit")) {
    CuddlePhish.gifmem = parseInt(
      app.settings.getSetting("cuddlephish", "memoryLimit")
    );
  }
  if (app.settings.haveSetting("cuddlephish", "fuzz")) {
    CuddlePhish.giffuzz = parseInt(
      app.settings.getSetting("cuddlephish", "fuzz")
    );
  }
  if (app.settings.haveSetting("cuddlephish", "width")) {
    CuddlePhish.gifwidth = parseInt(
      app.settings.getSetting("cuddlephish", "width")
    );
  }
  if (app.settings.haveSetting("cuddlephish", "wideortall")) {
    CuddlePhish.wideortall = parseInt(
      app.settings.getSetting("cuddlephish", "wideortall")
    );
  }

  //turbo mode
  if (app.settings.haveSetting("cuddlephish", "turboMode")) {
    CuddlePhish.turboMode = app.settings.getSetting("cuddlephish", "turboMode");
    if (CuddlePhish.turboMode == "true") {
      CuddlePhish.turboMode = true;
    } else {
      CuddlePhish.turboMode = false;
    }
  }

  /* //dither settings
if (app.settings.haveSetting("cuddlephish", "ditherpattern")) {
    CuddlePhish.gifdithersetting = parseInt(app.settings.getSetting("cuddlephish", "ditherpattern"));
    //alert(gifdithersetting);
}
if (app.settings.haveSetting("cuddlephish", "redlevelsetting")) {
    redlevelsetting = parseInt(app.settings.getSetting("cuddlephish", "redlevelsetting"));
}
if (app.settings.haveSetting("cuddlephish", "greenlevelsetting")) {
    greenlevelsetting = parseInt(app.settings.getSetting("cuddlephish", "greenlevelsetting"));
}
if (app.settings.haveSetting("cuddlephish", "bluelevelsetting")) {
    bluelevelsetting = parseInt(app.settings.getSetting("cuddlephish", "bluelevelsetting"));
} */

  //from comp settings these require parsing
  if (app.settings.haveSetting("cuddlephish", "widthfromcomp")) {
    CuddlePhish.widthfromcomp = app.settings.getSetting(
      "cuddlephish",
      "widthfromcomp"
    );
    if (CuddlePhish.widthfromcomp == "true") {
      CuddlePhish.widthfromcomp = true;
    } else {
      CuddlePhish.widthfromcomp = false;
    }
  }

  if (app.settings.haveSetting("cuddlephish", "fpsfromcomp")) {
    CuddlePhish.fpsfromcomp = app.settings.getSetting(
      "cuddlephish",
      "fpsfromcomp"
    );
    if (CuddlePhish.fpsfromcomp == "true") {
      CuddlePhish.fpsfromcomp = true;
    } else {
      CuddlePhish.fpsfromcomp = false;
    }
  }

  //other variables
  CuddlePhish.scriptPath = new File($.fileName).parent.fsName;
  var phishworkingDir =
    CuddlePhish.scriptPath.toString() + "\\ProjectCuddlePhish\\"; //setting up the path to the final batch

  var phishIcon = File(phishworkingDir + "cuddlephish.png");

  //UI code
  function CuddleScript(thisObj) {
    function myScript_buildUI(thisObj) {
      var mainPanel =
        thisObj instanceof Panel
          ? thisObj
          : new Window("palette", CUDDLEPHISH_VERSION, undefined, {
              resizeable: true
            });

      mainPanel.orientation = "row";

      var res =
        "Group{orientation:'column',\
            goButton: Button{text:'Squirt GIF',},\
            optionsButton:Button{text:'Options'}}";

      mainPanel.grp = mainPanel.add(res);

      mainPanel.helpgrp = mainPanel.add("group");
      mainPanel.helpgrp.add("iconbutton", undefined, phishIcon, {
        name: "helpbutton"
      });
      mainPanel.helpgrp.helpbutton.onClick = PhishHelpWindow;
      mainPanel.helpgrp.helpbutton.helptip = "About PROJECT CUDDLEPHISH";
      mainPanel.helpgrp.helpbutton.alignment = "fill";

      mainPanel.grp.goButton.helptip = "Render GIF";
      mainPanel.grp.goButton.onClick = PhishConfirmGif;
      mainPanel.grp.optionsButton.onClick = PhishOptionsWindow;

      mainPanel.layout.layout(true);
      return mainPanel;
    }
    var myScriptPal = myScript_buildUI(thisObj);
    if (myScriptPal != null && myScriptPal instanceof Window) {
      myScriptPal.center();
      myScriptPal.show();
    }
  }
  CuddleScript(thisObj);

  function PhishHelpWindow() {
    var helpWin = new Window("dialog", CUDDLEPHISH_VERSION, undefined, {
      resizeable: true
    });
    helpWin.add(
      "statictext",
      undefined,
      CUDDLEPHISH_VERSION +
        " by GunSquid.com JUN-3-2020\
    GIF compression provided by Gifski -  https://gif.ski",
      { multiline: true }
    );
    helpWin.show();
  }

  function PhishOptionsWindow() {
    if (app.settings.haveSetting("cuddlephish", "wideortall")) {
      CuddlePhish.wideortall = parseInt(
        app.settings.getSetting("cuddlephish", "wideortall")
      );
    }

    var optWin = new Window(
      "dialog",
      "Project CuddlePhish Options",
      undefined,
      { resizeable: true }
    );

    optWin.fpsgrp = optWin.add("panel", undefined, "Framerate Settings");
    optWin.fpsgrp.toprow = optWin.fpsgrp.add("group");
    optWin.fpsgrp.alignment = "fill";
    optWin.fpsgrp.toprow.alignment = "left";
    optWin.fpsgrp.toprow.add("statictext", undefined, "Desired FPS:");
    var userFps = optWin.fpsgrp.toprow.add(
      "edittext",
      undefined,
      CuddlePhish.giffps
    );
    userFps.characters = 4;
    userFps.helpTip = "Enter the desired framerate for your GIF";
    //optWin.fpsgrp.toprow.add("statictext", undefined, "Frames per second");
    var fpsCheckbox = optWin.fpsgrp.add(
      "checkbox",
      undefined,
      "Use FPS from comp"
    );
    fpsCheckbox.onClick = GhostFpsOptions;
    fpsCheckbox.alignment = "left";

    //get options and set checkbox values
    if (CuddlePhish.fpsfromcomp == true) {
      fpsCheckbox.value = true;
      userFps.enabled = false;
    } else {
      fpsCheckbox.value = false;
      userFps.enabled = true;
    }

    function GhostFpsOptions() {
      if (fpsCheckbox.value == false) {
        userFps.enabled = true;
      } else {
        userFps.enabled = false;
      }
      this.window.layout.layout(true);
    }

    // optWin.memgrp = optWin.add("group");
    // optWin.memgrp.alignment = "left";
    // optWin.memgrp.add("statictext", undefined, "Memory limit:");
    // var userMem = optWin.memgrp.add("edittext", undefined, gifmem);
    // userMem.characters = 6;
    // userMem.helpTip = "Use this setting to limit how much RAM GIFsquid will use.";
    // optWin.memgrp.add("statictext", undefined, "Megabytes");

    optWin.fuzzgrp = optWin.add("panel", undefined, "Compression Settings");
    optWin.fuzzgrp.toprow = optWin.fuzzgrp.add("group");
    optWin.fuzzgrp.alignment = "fill";
    optWin.fuzzgrp.alignChildren = "left";
    optWin.fuzzgrp.toprow.add("statictext", undefined, "Quality");
    var userFuzz = optWin.fuzzgrp.toprow.add(
      "edittext",
      undefined,
      CuddlePhish.giffuzz,
      { readonly: true }
    );
    userFuzz.characters = 4;
    userFuzz.helpTip = "Higher quality results in larger file sizes";
    var fuzzSlider = optWin.fuzzgrp.toprow.add(
      "slider",
      undefined,
      CuddlePhish.giffuzz,
      1,
      100
    );
    fuzzSlider.onChanging = PhishUpdateFuzzText;

    function PhishUpdateFuzzText() {
      userFuzz.text = Math.round(fuzzSlider.value);
    }

    var turboCheckbox = optWin.fuzzgrp.toprow.add(
      "checkbox",
      undefined,
      "Turbo Mode"
    );
    turboCheckbox.helpTip = "Sacrifce some quality for faster encoding speed.";
    if (CuddlePhish.turboMode == true) {
      turboCheckbox.value = true;
    } else {
      turboCheckbox.value = false;
    }

    optWin.fuzzgrp.add(
      "statictext",
      undefined,
      "Higher quality results in larger file sizes",
      { multiline: true }
    );

    optWin.widthgrp = optWin.add("group");
    optWin.widthgrp.alignment = "left";
    var resizeCheckbox = optWin.widthgrp.add("checkbox", undefined, "");
    resizeCheckbox.onClick = GhostResizeOptions;
    optWin.widthgrp.add("statictext", undefined, "Resize to");
    var userWidth = optWin.widthgrp.add(
      "edittext",
      undefined,
      CuddlePhish.gifwidth
    );
    userWidth.characters = 6;
    userWidth.helpTip =
      "Your GIF will be scaled to this size. Aspect ratio is preserved";
    optWin.widthgrp.add("statictext", undefined, "Pixels");
    var wideOrTall = optWin.widthgrp.add("dropdownlist", undefined, [
      "Wide",
      "Tall"
    ]);
    wideOrTall.selection = CuddlePhish.wideortall;

    if (CuddlePhish.widthfromcomp == true) {
      resizeCheckbox.value = false;
      userWidth.enabled = false;
      wideOrTall.enabled = false;
    } else {
      resizeCheckbox.value = true;
      userWidth.enabled = true;
      wideOrTall.enabled = true;
    }

    function GhostResizeOptions() {
      if (resizeCheckbox.value == false) {
        userWidth.enabled = false;
        wideOrTall.enabled = false;
      } else {
        userWidth.enabled = true;
        wideOrTall.enabled = true;
      }
      this.window.layout.layout(true);
    }

    // optWin.dithergrp = optWin.add("group");
    // optWin.dithergrp.alignment = "left";
    // optWin.dithergrp.add("statictext", undefined, "Dithering Pattern");
    // var userDither = optWin.dithergrp.add("dropdownlist", undefined, ["none", "o8x8", "o4x4", "h4x4a", "h6x6a", "h8x8a", "c5x5b", "c5x5w", "c6x6b", "c6x6w"]);
    // userDither.selection = gifdithersetting;
    // userDither.helpTip = "Select a Dithering Pattern";

    // var advButton = optWin.dithergrp.add("button", undefined, "Advanced");
    // advButton.onClick = advancedDither;
    // advButton.helpTip = "Advanced Dithering Settings";

    optWin.buttongrp = optWin.add("group");
    optWin.buttongrp.alignment = "right";
    optWin.buttongrp.add("button", undefined, "OK");
    optWin.buttongrp.add("button", undefined, "Cancel");

    //optWin.show();

    if (optWin.show() == 1) {
      //this stuff is run when you press OK
      CuddlePhish.giffps = parseInt(userFps.text);
      app.settings.saveSetting("cuddlephish", "framerate", CuddlePhish.giffps); //setting vars for batchfile, also saving to settings file.

      // gifmem = parseInt(userMem.text);
      // app.settings.saveSetting("cuddlephish", "memoryLimit", gifmem);

      CuddlePhish.giffuzz = parseInt(userFuzz.text);
      if (CuddlePhish.giffuzz <= 0) {
        CuddlePhish.giffuzz = 1;
      }
      app.settings.saveSetting("cuddlephish", "fuzz", CuddlePhish.giffuzz);

      CuddlePhish.gifwidth = parseInt(userWidth.text);
      if (CuddlePhish.gifwidth < 1) {
        CuddlePhish.gifwidth = 1;
      }
      app.settings.saveSetting("cuddlephish", "width", CuddlePhish.gifwidth);

      // gifdithersetting = userDither.selection;
      // app.settings.saveSetting("cuddlephish", "ditherpattern", gifdithersetting.index);

      CuddlePhish.wideortall = wideOrTall.selection.index;
      app.settings.saveSetting(
        "cuddlephish",
        "wideortall",
        CuddlePhish.wideortall
      );

      //save "from comp settings"
      if (resizeCheckbox.value == true) {
        CuddlePhish.widthfromcomp = false;
      } else {
        CuddlePhish.widthfromcomp = true;
      }
      app.settings.saveSetting(
        "cuddlephish",
        "widthfromcomp",
        CuddlePhish.widthfromcomp
      );

      if (fpsCheckbox.value == true) {
        CuddlePhish.fpsfromcomp = true;
      } else {
        CuddlePhish.fpsfromcomp = false;
      }
      app.settings.saveSetting(
        "cuddlephish",
        "fpsfromcomp",
        CuddlePhish.fpsfromcomp
      );

      //save Turbo Mode settings
      if (turboCheckbox.value == true) {
        CuddlePhish.turboMode = true;
      } else {
        CuddlePhish.turboMode = false;
      }
      app.settings.saveSetting(
        "cuddlephish",
        "turboMode",
        CuddlePhish.turboMode
      );

      // gifdither = "-ordered-dither " + gifdithersetting.text + "," + redlevelsetting.text + "," + greenlevelsetting.text + "," + bluelevelsetting.text;
      // if (gifdithersetting.text == "none") {
      //     gifdither = "";
      // } else if (!redlevelsetting.text) {
      //     alert("Please go to the advanced settings and click OK");  //todo: create a globalscope variable to handle this seamlessly
      // }
      //alert(gifdither);
      //alert(redlevelsetting);
    }
  }

  function PhishAddCompToQueue() {
    var comp = app.project.activeItem;
    var rq = app.project.renderQueue;

    if (!(comp instanceof CompItem)) {
      alert(
        '"' + comp.name + '"' + " is not a Comp. Select a Comp and try again"
      );
    }

    rq.items.add(comp);
    var lastComp = rq.numItems;
    rq.item(lastComp).outputModule(1).applyTemplate("Lossless"); //add to queue

    var newFilePath = app.project.file.parent.toString();

    var oldLocation = rq.item(lastComp).outputModule(1).file; //save current filename
    if (oldLocation) {
      newFilePath += "/" + oldLocation.name;
    }

    rq.item(lastComp).outputModule(1).file = new File(newFilePath); //set path to project path
  }

  function PhishConfirmGif() {
    if (app.project.file == null) {
      alert("Please save your project and try again");
      return;
    }
    if (
      confirm(
        "It may appear that After Effects has crashed, but rendering will continue.\n\nAfter rendering, we compress your GIF in a DOS window. It is fun.\n\nContinue?",
        false,
        "Squirt GIF?"
      )
    )
      PhishMakeGif();
  }

  function PhishMakeGif() {
    //app.beginUndoGroup("Cuddlephish"); Undo groups don't work great with render queue
    //alert("Rendering will begin after closing this dialog. It may appear that After Effects has crashed, but rendering will continue. After Rendering is complete, some DOS windows will come up, don't close them.  Converting to GIF takes a long time. When it is done, the output folder will open in explorer")

    //deQueueOthers();
    clearQueue();
    PhishAddCompToQueue();

    //alert("calling addComp");
    app.project.renderQueue.render();
    //alert("calling Render");
    PhishRunBat();
    //alert("calling runBat");
    //app.endUndoGroup(); Undo groups don't work great with render queue
  }

  function PhishRunBat() {
    //builds the strings and builds/calls the batch file
    var comp = app.project.activeItem;
    var currentOM = app.project.renderQueue
      .item(app.project.renderQueue.numItems)
      .outputModule(1);
    var sizesetting = "";

    CuddlePhish.gifdither = "";
    if (CuddlePhish.wideortall == 0) {
      sizesetting = CuddlePhish.gifwidth.toString() + ":-1";
    } else {
      sizesetting = "-1:" + CuddlePhish.gifwidth.toString();
    }
    if (CuddlePhish.widthfromcomp == true) {
      sizesetting = comp.width.toString() + ":-1";
    }

    if (CuddlePhish.fpsfromcomp == true) {
      CuddlePhish.giffps = Math.round(comp.frameRate);
    }

    var aviPath = currentOM.file.fsName;
    var pngPath = currentOM.file.parent.fsName;
    var gifName = currentOM.file.displayName;
    var outPath = pngPath + "\\CuddlePhish_Output";

    var cmd =
      "GIFsquidLesinski.bat " +
      CuddlePhish.giffps.toString() +
      " " +
      CuddlePhish.gifmem.toString() +
      " " +
      '"' +
      aviPath +
      '" ' +
      '"' +
      outPath +
      '" ' +
      CuddlePhish.giffuzz.toString() +
      " " +
      sizesetting +
      ' "' +
      gifName +
      '" ' +
      CuddlePhish.turboMode;

    var workingDir =
      '"' + CuddlePhish.scriptPath.toString() + '\\ProjectCuddlePhish\\"';
    var batName = "\\squidyavi.bat";
    var batPath = Folder.appData.fsName.toString() + batName;
    var batFile = new File(batPath);
    batFile.open("w");
    batFile.write("cd\\ \n" + "cd " + workingDir + "\n" + cmd + "\n" + "exit");
    batFile.close();

    batFile.execute();
    //alert(cmd);
    //alert(aviPath);
  }

  function clearQueue() {
    var rqi = app.project.renderQueue;

    for (var i = 1; i <= rqi.numItems; i++) {
      rqi.item(i).remove();
    }
  }

  function deQueueOthers() {
    //doesn't work reliably, issues with half-rendered, cancelled items
    var rqi = app.project.renderQueue;
    for (var i = 1; i <= rqi.numItems; i++) {
      if (rqi.item(i).render == true) {
        rqi.item(i).render = false;
      }
    }
  }
})(this);
