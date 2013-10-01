// Generated by CoffeeScript 1.6.3
(function() {
  var CommandBase, HelpCommand, Terminal, greet, prompt,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  greet = function(callback) {
    var str;
    str = "[[gb;#ffffff;#000]CatX.FM 猫杀电台\r\n]";
    str += "[[;#e67e22;]music provided by douban.fm]\r\n";
    str += "Type [[ub;#2ecc71;#000]channel] to discovery music, or ";
    str += "[[ub;#2ecc71;#000]help] for full command list\r\n";
    str += "[[gb;#929292;#000]......]";
    return str;
  };

  CommandBase = (function() {
    function CommandBase(name, desc) {
      this.name = name;
      this.desc = desc;
    }

    CommandBase.prototype.echo = function(msg) {
      var _ref;
      if ((_ref = window.T) != null) {
        _ref.echo(msg);
      }
    };

    CommandBase.prototype.register = function() {
      var _ref;
      return (_ref = window.TERM) != null ? _ref.registerCommand(this.name, this) : void 0;
    };

    CommandBase.prototype.execute = function() {
      this.echo("Command Base");
    };

    CommandBase.prototype.getHelpString = function() {
      var len, padding;
      len = this.name.length;
      padding = Array(10 - len).join(" ");
      return "[[ub;#2ecc71;#000]" + this.name + "]" + padding + this.desc;
    };

    CommandBase.prototype.on_error = function(status, error) {
      window.T.resume();
      this.echo("Status: " + status);
      this.echo("Error: " + error);
      this.echo("Error, try again later");
    };

    return CommandBase;

  })();

  if (window.CommandBase == null) {
    window.CommandBase = CommandBase;
  }

  HelpCommand = (function(_super) {
    __extends(HelpCommand, _super);

    function HelpCommand(name, desc) {
      HelpCommand.__super__.constructor.call(this, name, desc);
      if (window.Help == null) {
        window.Help = this;
      }
    }

    HelpCommand.prototype.execute = function() {
      var cmd, name, _ref;
      this.echo("[[b;;]Available Commands]");
      this.echo("--------------------------------");
      _ref = window.commands;
      for (name in _ref) {
        cmd = _ref[name];
        this.echo(cmd.getHelpString());
      }
      this.echo("--------------------------------");
    };

    HelpCommand.prototype.completion = function(term, str, cb) {
      var cmd, name;
      cb((function() {
        var _ref, _results;
        _ref = window.commands;
        _results = [];
        for (name in _ref) {
          cmd = _ref[name];
          _results.push(name);
        }
        return _results;
      })());
    };

    HelpCommand.prototype.errorMessage = function(cmd) {
      this.echo("[[gb;#e67e22;#000]Unknown command:] [[gub;#e67e22;#000]" + cmd + "]");
      return this.echo("Type [[ub;#2ecc71;#000]help] for command list");
    };

    return HelpCommand;

  })(CommandBase);

  prompt = "♫>";

  Terminal = (function() {
    Terminal.prototype.setUser = function(user) {
      var name, name_str, _ref, _ref1;
      name = (_ref = user != null ? user.user_name : void 0) != null ? _ref : "";
      name_str = name !== "" ? "[" + name + "]" : "";
      return (_ref1 = window.T) != null ? _ref1.set_prompt(name_str + prompt) : void 0;
    };

    function Terminal() {
      if (window.commands == null) {
        window.commands = {};
      }
    }

    Terminal.prototype.start = function(options) {
      window.T = $('body').terminal(this.interpret, options);
    };

    Terminal.prototype.interpret = function(name, term) {
      var cmd, commands, parse, _ref;
      term.echo("[[gb;#929292;#000]...]");
      parse = $.terminal.parseCommand(name);
      commands = window.commands;
      if ((commands != null) && (commands[parse.name] != null)) {
        cmd = commands[parse.name];
        cmd.execute.apply(cmd, parse.args);
      } else {
        if ((_ref = window.Help) != null) {
          _ref.errorMessage(name);
        }
      }
      term.echo("[[gb;#929292;#000]...]");
    };

    Terminal.prototype.registerCommand = function(name, command) {
      window.commands[name] = command;
    };

    return Terminal;

  })();

  if (window.TERM == null) {
    window.TERM = new Terminal();
  }

  (new HelpCommand("help", "Show help")).register();

  jQuery(document).ready(function() {
    return window.TERM.start({
      prompt: prompt,
      name: 'catx.fm',
      greetings: greet,
      history: true,
      tabcompletion: true,
      completion: window.Help.completion
    });
  });

}).call(this);

/*
//@ sourceMappingURL=terminal.map
*/
