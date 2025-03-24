module.exports = {
    'env': {
      'browser': true,
      'es2021': true
    },
    'extends': [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime'
    ],
    'overrides': [
      {
        'env': {
          'node': true
        },
        'files': [
          '.eslintrc.{js,cjs}'
        ],
        'parserOptions': {
          'sourceType': 'script'
        }
      }
    ],
    'parserOptions': {
      'ecmaVersion': 'latest',
      'sourceType': 'module'
    },
    'plugins': [
      'react'
    ],
    'rules': {
      'indent': [
        2,
        2,
        {
          'SwitchCase': 1,
          'ignoredNodes': ['TemplateLiteral']
        }
      ], //缩进
      'no-unused-vars': [0], //未使用变量
      'quotes': [2, 'single'], //单引号
      'jsx-quotes': ['error', 'prefer-single'],
      'no-console': [0, { 'allow': ['warn', 'error'] }], //console
      'linebreak-style': [0, 'unix'], //强制执行统一的行结尾
      'semi': [2, 'always'], //分号结尾
      'curly': 2,
      'no-eval': 1, //禁止使用eval
      'no-caller': 2,
      'no-else-return': 2, //如果if语句里面有return,后面不能跟else语句
      'no-extend-native': 2, //禁止扩展native对象
      'no-extra-bind': 2, //禁止不必要的函数绑定
      'no-floating-decimal': 2, //禁止省略浮点数中的0
      'no-implied-eval': 2, //禁止使用隐式eval
      'no-labels': 2, //禁止标签声明
      'no-with': 2, //禁用with
      'no-loop-func': 0, //禁止在循环中使用函数（如果没有引用外部变量不形成闭包就可以）
      'no-native-reassign': 2, //不能重写native对象
      'no-redeclare': [2], //禁止重复声明变量
      'no-unused-expressions': 0, //禁止无用的表达式
      'no-unneeded-ternary': 2, //禁止不必要的嵌套
      'no-use-before-define': 0, //未定义前不能使用
      'no-unreachable': 2, //不能有无法执行的代码
      'no-trailing-spaces': 1, //一行结束后面不要有空格
      'no-dupe-keys': 2, //在创建对象字面量时不允许键重复 {a:1,a:1}
      'no-dupe-args': 2, //函数参数不能重复
      'no-duplicate-case': 2, //switch中的case标签不能重复
      'array-bracket-spacing': [2, 'never'], //是否允许非空数组里面有多余的空格
      'arrow-body-style': [1],
      'no-undef-init': 0,
      'no-undefined': 0,
      'key-spacing': [
        //对象字面量中冒号的前后空格
        2,
        {
          'beforeColon': false,
          'afterColon': true
        }
      ],
      'no-lonely-if': 2, //禁止else语句内只有if语句
      'no-inner-declarations': [2, 'functions'], //禁止在块语句中使用声明（变量或函数）
      'no-spaced-func': 2, //函数调用时 函数名与()之间不能有空格
      'no-case-declarations': [0],
      'no-multiple-empty-lines': [1, { 'max': 2 }], //空行最多不能超过2行
      'space-in-parens': [2, 'never'], //小括号里面要不要有空格
      'no-multi-spaces': [2], //不能用多余的空格
      'no-irregular-whitespace': 2,//不能有不规则的空格
      'react/prop-types': [0],
      'react/display-name': [0],
      'react/no-string-refs': [0],
      'react/jsx-no-comment-textnodes': [0],
      'react/no-unescaped-entities': [0]
    },
  };
  
  