module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'display': [ 'Raleway', 'sans-serif' ],
      'body': [ 'Montserrat', 'sans-serif' ]
    },
    extend: {
      backgroundImage: theme => ({
        'interlaced': 'url("/assets/images/interlaced.png")'
      })
    },
  },
  variants: {},
  plugins: [],
}