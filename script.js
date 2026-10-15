const games = [
  {
    id: 1,
    title: 'Brawl Stars',
    genre: 'action',
    path: 'Games/Brawl%20Stars.html',
    thumb: 'https://www.4gamer.net/games/384/G038494/20181213131/TN/001.jpg'
  },
  {
    id: 2,
    title: 'Drift Hunters',
    genre: 'racing',
    path: 'Games/Drift%20Hunters.html',
    thumb: 'https://imgs.crazygames.com/games/drift-hunters/cover-1656950639575.png?metadata=none&quality=100&width=1200&height=630&fit=crop'
  },
  {
    id: 3,
    title: 'Geometry Dash',
    genre: 'action',
    path: 'Games/Geometry%20Dash.html',
    thumb: 'https://imgs.crazygames.com/games/geometry-dash-online/cover_16x9-1732744370399.png?metadata=none&quality=60&height=7089'
  },
  {
    id: 4,
    title: 'Madalin Stunt Cars 2',
    genre: 'racing',
    path: 'Games/Madalin%20Stunt%20Cars%202',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNO5-ZGXM41qjQ_UwUKrS35OyZrHkyiFTr4rGHHO-HUQ&s=10'
  },
  {
    id: 5,
    title: 'Madalin Stunt Cars 3',
    genre: 'racing',
    path: 'Games/Madalin%20Stunt%20Cars%203.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSllDuVPEWFXX8xdCdDT5u3YfDu7bJacPQMDdrvEcRIMA&s=10'
  },
  {
    id: 6,
    title: 'Real Flight Simulator',
    genre: 'simulator',
    path: 'Games/RFS.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRitjB3E8W0JDsmXv8Y3MDUdSRuKVqbQQG63dGX3mkNNg&s=10'
  },
  {
    id: 7,
    title: 'Slope',
    genre: 'action',
    path: 'Games/Slope.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkrvwXmhXpn8cnl3DMr54X1FdOt3qb-g2A3yOh8Pn-xw&s=10'
  },
  {
    id: 8,
    title: 'Slope 2 Player',
    genre: 'action',
    path: 'Games/Slope 2 Player.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCIyOlCeQ_dhbh7Q0gL2jZJ0tkhFSc0aOJhO4EowcZHw&s'
  },
  {
    id: 9,
    title: 'Slope 3',
    genre: 'action',
    path: 'Games/Slope3.html',
    thumb: 'https://slopegame.net/data/image/game/slope-3.jpg'
  },
  {
    id: 10,
    title: 'Survivor.io',
    genre: 'iogame',
    path: 'Games/Survivor.io.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvuruXdzy2W6gxRCsvJUmSOnqOC--IASAyZFsRmnakQA&s=10'
  },
  {
    id: 11,
    title: 'GTA Vice City',
    genre: 'action',
    path: 'Games/GTA%20Vice%20City.html',
    thumb: 'https://m.media-amazon.com/images/I/81ZbKIAivOL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    id: 12,
    title: 'Paper.io',
    genre: 'iogame',
    path: 'Games/Paperio.html',
    thumb: 'https://paperio3d.org//data/image/game/paper-io-favicon.jpg'
  },
  {
    id: 13,
    title: 'Cookie Clicker',
    genre: 'casual',
    path: 'Games/CookieClicker.html',
    thumb: 'https://g.hebi.gg/cookie-clicker/cookie-clicker.jpg'
  },
  {
    id: 14,
    title: 'UnderTale',
    genre: 'casual',
    path: 'Games/Undertale.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg50zBrs6KuLnjGh0HoUCeBRySQtb_XBbUy_a0glzDV6mE6_sVVGSbSr3N&s=10'
  },
  {
    id: 15,
    title: 'Slither.io',
    genre: 'iogame',
    path: 'Games/Slither.io.html',
    thumb: 'https://imgs.crazygames.com/games/slitherio/cover-1587331280441.png?format=auto&quality=100&metadata=none&width=1200'
  },
  {
    id: 16,
    title: 'Block Blast',
    genre: 'casual',
    path: 'Games/Block Blast.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgIb7d5_g-i_ouK7U45WmMLRUCIUgEAR_5mfnxCBHvTg&s=10'
  },
  {
    id: 17,
    title: 'R.E.P.O',
    genre: 'action',
    path: 'Games/REPO.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDRgAxCe4WV_w3YhvKJxUmZn7hV_8yHmGulR1MXsoNqQ&s=10'
  },
  {
    id: 18,
    title: 'Snow.io',
    genre: 'iogame',
    path: 'Games/Snow.io.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtBX44GQvtdN4XRC-WirHMgiexZD_Zb-Hjh9iESyvGTw&s=10'
  },
  {
    id: 19,
    title: 'Snowride',
    genre: 'casual',
    path: 'Games/Snowride.html',
    thumb: 'https://imgs.crazygames.com/snow-rider-3d_16x9/20260120063434/snow-rider-3d_16x9-cover?metadata=none&quality=60&height=6212'
  },
  {
    id: 20,
    title: 'ちいかわパズル',
    genre: 'puzzle',
    path: 'Games/Chikawa.html',
    thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbLUytF6Ea310R05pGmYL_icBYC5kdC2D7ehYNpkGSuA&s'
  },
  {
    id: 21,
    title: "Burnin' Rubber 5 XS",
    genre: 'racing',
    path: "Games/Burnin' Rubber 5 XS.html",
    thumb: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLs9JpAgQXiieoPlVjNehQoQwgEgnRnSOjuc4VQvIa3g&s=10"

  },
   {
    id: 22,
    title: "Agar.io",
    genre: 'iogame',
    path: "Games/Burnin'Agar.io.html",
    thumb: "https://agaronline.io//data/image/game/f6bd63ca150f0bf49c9dd61bae254c33_fgraphic.png"

  },
    {
    id: 23,
    title: "MR Racer",
    genre: 'racing',
    path: "Games/Burnin'Mr.Racer.html",
    thumb: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk8BDg4OExETJhUVJk81LTVPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT//AABEIAIEA9gMBEQACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAADAAECBAUGB//EAEQQAAEDAgMFBQQGBwYHAAAAAAEAAgMEEQUSIQYTMUFhIlFxkaEUMoHRFTNCUrHBI0NTYnKS4SREVILw8RY0RYOEk6L/xAAaAQADAQEBAQAAAAAAAAAAAAAAAQIDBAUG/8QAMREAAgIBAwMCBAQHAQEAAAAAAAECEQMEEiETMVEFQRQiUmEVcYHwIzJCkaGx4TMk/9oADAMBAAIRAxEAPwDmZY2xx2bqb6hcCbbADd8buw22YWCsATmEF1zp3q0w5IS9st6CyFwy5O0QDWtJudVTIDMy21kUMCxA1ma5ObookM2KRkeS+UN+CwlYB8wiYS7hdTVlA6iotGABa6qMeQKBeTx4LQEI24osbQ7I3yfVsc7wBKfIiwyhqCNQxnV7wPzVLHN+wtyCCgaPfrKZv+Yn8Ar6GTwLeiXsdIPexOEeEbimtPkDfEcU+Gj3sTcT0pz80/hpi6kR91hI/wCozH/xz80fCzDqREIsKI0xKQeNMfmj4aYdSJYp5KSBjmw4tYO43gPzUS0kn3HviTjppq57oqbEoZXEXcMjhos5YOmrkC5KdbszWU9RvGQh8ZGpaeBQp8UPazGnjkppCJYiO66pciot0Fc+kmZJEy9uIUtWCO1wTaeAx5atr4ieBJzLOnHsWjpIa+knbmiqYnDo4KdzGCnxShg1kqGXHJpui7AzajaWjb9XDJKeugRTYWZ0+1NU64hijiHIntFPaKzNnxaunuJamQjuBsnQWVTK48SmIwpXHdhjGjjq5aJc2QSb2QGjRxIs7uQ0BVLAZ3gWd32VrsBFtP8AptAbWQ5JGqg3HgqznJI5gHDitFyrIkq4I6lugCQi2xrxE0sHFRxYGph9WNzkeBodVjOHNoYeWojeMlvVRtaGQbTyS6vcI4+Wc6/ALpx4JyJc0gwbQQDXNM7942HkuqOmiu5m8jBur2M+qhjb4NC1WOC9hOTaAvr5X/aV8IjkCZnuPHzT3DoZxdbV4CnePaCfIW8yixUCdMe9OwogZ3d6LChjMUrCht8U7HR2uwkOamqqp/EvDGnoB/VeR6jP54x/U6MK4bLGJSy1dTII66ogLXlrHRP0FtDpwPNdGOEdibQm+TEdXt9odRYw3K9mrahrey5vInu8eCmWKuYjtMHUUrIn3aCWfZc0ixHisuRVQSIR2aC5l9b6hZuwCOMY7TXsaf4gkrGQNW1hs+Rh/wAytRsCbZmP903Q0wJcVIESLIsY1wgDHGi2IoZ17IsKGiYGSdOaTfA13NNtXRwNDSzMSuN4sk5WerHPihjpGLVxtfUOdGLhx0XdBtR5PMm05WiEVN2+1yQ5E0W4Ruzw0UNjDw0zpu1bKAdXqoQlJ0hN0WQIoR+ibc83u/JduPFCH5mTbYGSUuJINz3lbWRRUfK4m19E7CiOdtlBRDeDNYBMKJuaQLm4CjeuxfTfcDvQL2vfqmJAnzOdxKokgLuKAoRAA4osBg4jX8UhjGQc3DzTEel7IR7rZinP7Uuk8e1p6BeBrpXnaOrEvlOew2UsxKroJT7zjUQkniHG7h8CV7CVJIxAY/K2N9PYtbOzVriQOzwII5g/klYzMZXN3UkL2UzoXkFsZfow97TfS/dwUyV8jXAfDKUVhcKWISPZqWtsbXWOS4+4JWaJw2vaMrqAW7ywLHd9x0yvUYXKQP7PkI4nKqjlrux0TiYYmBhvdS5WIM2QjkkAdkrHaOClrwNMlu2ngp3GixyfNGCugxHtokAkDAzAl1mgk2vYJouPZlqgwjEp2h0dHORyJblHqlKa7EJNmpDsziL7Z2xR/wATx+Szcytpbj2TlBvLUROH3BcD4rSGSC/mE4v2CTYPX5MjGwZRwa1/9Fc9Xiiu9DhBruZbqWeKV8U9LUXYeURI+BClZk1cZcHTUGuUCmhmLcsWHVjuu4cuiGaK7yOXJHn5UUvo3Enm/wBG1Y/7RC0+JxfUZdOXgY4Pix93DKk+LQPxS+Kw/UPpyEMBxxx0w2UeL2D80nq8P1fv+wLHMsf8PY9I0A0mUdZWfNZ/F4E+5o4zfA7dk8Z+5A2/My/IIevxfclYZGvFsTSgA1FZO53MMDQPwXLL1KXskUsKLceyGENHabUSfxTEfhZYv1LJ5RfRiWWbNYKwaUDD/E9zvxKh+oZPqH04+ArMDwph7OG0wH8Ch67I+8h7I+ArcNw9psyhgv0YNFL1Un3Y9iL0UbWQtiYwNY0Wa0CwCwc9zuh1RiYvs9DK+Cro3mCphd2dbtIPEHou/wDEJwpy5X+TPpJ9jmsZwarr9p6eGqp5WUgAD5WDQDUnXkvRjmhJPb3MtrXc34th9nsodkqJQebpjr5WXNLVV7l7DZwzC6DCYXRUEAia43d2i4n4lYy1LkylGi7oTwWbyNjoi+NkjS0gePVEWDRi1lIwZmlgzDRaJkmBOzJIQqTJBttcX4IfbgqNJ2y4yqjYLBl1zPTyl3Z3fGRSpIw8jvunyXceaMWu+6fJAx2se5wa1ri5xsABqUmwOywPA46BoqJWB1SRz4M6Bcs877I1iqRsnqVg8jfuVQuz3pb/ACFC05eaz6kpcQHVDZeqSxxTuXIWMQr6gDJdQBXSeUKEp6oUJLqjoV0uowoYG+qMmSkkFDrHcxisluAiXsabOeweLghNvsAmu3g/RuBH3hwT/MAjGgcAmm2wJ3sbrSImchjW2FLQYmabdSTFh7bmEWb0HeV1YdBkzw6l14IlkUeDpaWrir6GOoidmjewOv3graE5U1LuuGFL2DRNEbMpNgEpVJh2ByTP4QxOd1d2f6pLF9ws5baarxqnopXQ1bYI2AECFtib95W2GeN5VBqxSi9tmrslik1fs9DLXH9K0lmbm8DS/wDruWWqljxZXEIXJWDdj2G188kdLMXSQ9l/ZNvPmr6c1FSkqsVr2Myt7Ul76KkxMq2VWSMnYFrJFzmjXT00Ia0P7eNPoiNTBqVr3NmY+N7nPDY+6/NefrZbKhHu/wBo0gvc66ejIp3iKRu9Y29i3RZT0W2L2zuUeWgU+TIhmbPC2RvPQjuI4hcj47mq5CLN/M+exQrlVuFQrlLcwoSlyGJLcAktwCSsBIsBG9jZNPkCnX4rQ4Ywe1TgPI0jaMzz8FriwZc7+RCcku5yeMbWYg8tjoqc0sb9A91i8j8B6r1cHp2KKvI91f2MpTl7HabMYbTHCGVdW0zzS+8XEkrFQxuMsmRWk6pf8Jt9ihtBslS1eKxPYHRwjtSNB49EZdQ9JOWKPPixxW7ua8MMcELYYIwyNgytaBoAvNbcnbNhxpxQmOyviFU2lo5pjwjYXa9FcFukoL3F9zy2SnjJgE8G8q68mV73H3L6gAL6iK2ql7HJ35Z1mwVQW0dXQyPzezy2bfk08PzXn6mKjl3fUv8AKNocqjp5Jsr2gWII1Xn5Mu2So0StCkmbuzlOv4KpZko8Ao8nMbWuDcKkbf3soR6f82dMeTiDI0pdRbDMfESyR1Ocvfmfw9SqlHq62n5/0QnWM5yngjpcTj9njyNad07tE5tNSfiF7ObmHJjHhnRufDlGZrSel1zQWNdxtkM1P9wLS8RNsbPTfs/RF4g5Kj8XY0NJYLu4ANCuLYi7A6qmLN2acGS2UOGq1U41bFXsau4xWHFqeWGFhp4mjg8Al3M2Xh5MmPInKT+Z/wCPB0U+EdLPilqZxZSy714tpY/miesU4tRjUmqbEsfJg4dTywS1EkjgBM7NuhezTbU/Fc+SacVFextSRfzf6ssaYCv0PklTAV+jvIpUwFmHcfJSxj5v3T5JALN+6UCFm/dcgYsx+4fRKwBVEbp6d8TXSRF4sHsdlI+KqM9rTYqs5ek2XxKnndJ7TSkk6Pe0yHx1HFetk9SwSVbX/ozUGixUbLVNa8OrcTzW4ZYbW9VnH1KGNVCFfqOUXLuzp8Ga7DKUU7Z3SNH3guNa7LCblj4sHjTLUsjpDmJJKyuUpOc3bY0kuwFwNvfd6J2MGRlHvOv4pOW1DRz21soiwSUFzv0rmx6uPAnX0uuv01b86fgjI6ictUZaisppYL5Q4hvTkvovJzmps5LGzaKtihPYdAPiWnU//RXDr1/Di/uaY/5jq7i3BeM4KzcbM0A6+iqMYgctttL/AGaKJvF79PgF2+mx/iSkRl/loPtXMKHA6WnZ+1jabdzdfyT0K35nL8ycnEKMmKRp9mc+39pkLuun+69SabjRkmaL3Bp91v8APdTHAgciBeD93yur6SFuImTuJ8k9iCzLETJDmfpZY7iTRoZHU0slWw5xTRukFxfgFjndwUPLovGrdl2n20jlsHNjBPI3auSehkjZTRoR7RskbpDm/hk/oueWmaLTCtxyM8aeT+YLJ4X5GFbjEJGsMg8lDwsYRuLQH9XJ5D5pdJhQT6Tpz9mQfAfNS8bChfSER4Nk9FLxsKF7cw8GO9EumOh/bB9w+apRopIia439wealwJoRrHAXLWgd5KNl9goryYxTx/WVMDf8yuOnnLsmLgpT7VUEV71BcR91l1vHQZZewt0UZ8+20Dfqonu/icG/hddEPS5vuyXlig+ze1EuK4x7M+MNYGFws4m/L80tVoY4Makn7ijk3Ojry9ecUQL0WkMC99yo5kxo5Lbqa0NDDf3pi4/Bp+a9j0mFSk/sY5uyRi7N1DRSVL5WZzT3cwdV7MkYonsXmOKvklzBzon6nncgrl1//mvzLxdzurrxH3OgYuJ0Fz4KopvsBlYthHt89PM5+V0MrX5TwLQQSPRbYM08W5V3FJKVGTtvJndh8BdlzyOJPdwF/Vdfpypyf2Rlm9gE0FBFHCIhK90YtHmPAc3FekrsyYQvPLgrJJsinl9yNxHggCXsrh9Y9jehcokXGvBjSsk95p48liqINCmu3CKwg3Lo7eq59Qvmg/ua4vc48m7ivRMyYc5vuuI8ClS8AWYcSrIHAsneQDwJvdZywY5d0UptHZ0s7KmnjnjN2yC46LxckHCTizqi7Vlhrlk0UZtZjIEklNSkbyP61x4NHO3eV1YtLwpz7PsZSn7IVFjlBR0cUclRLI7UEuac1+qMujy5JtqNDWSKVG1QVkVdTieDMWOJAuFw5sUsUtsjSMk+UWcyzGQkd2Dra+l04rkDzmqqaiSokG+eWtcQMxv+K+lx44KK4OOU3boBZ5957vNaUieRZG89fFMBENHJAqNfYxxG08WXS7H38lw+pL/53+hpi/mPTTITzXzXLOkgX9U9oEHO6qkgOJ2wmZJjlBA89ljbuA6n+i970yFY3IwyvlIuMrKJjAyGlZBSguMbQ2xktoXHpddzRmEw+Z8lYyeRjGANcGNYLaGy4NXk+Xad+DTblbN0TR2uSvKTdmksSiCkqnAWjBI/lC6Ffmjl4AufIfefYdPmlwgON2tnBxWnYNRG3Mbm/E/0XqaBfJKXkxyvlEYaiR8sc7xcSP7Temmi7KMjZ+kMn1NPDH1y3PmU6EV5ayeX6yVx6XsE6AAZO83SasqMqLDQA644rLYIMwZoJ26as5DqFhqVSi/DNcXc46eFzKh7AL2K64yTimZtciEUv7J/knuj5FTG3cg/Vv8A5SjcvIU/BubN1uQvo5Ltv22X9QuHW4r/AIiNsL9mb4l5DmvO2m5TdhUM1cypIDctyW2Hbv3rdamUcbgQ8a3WaIpaQEO9miuDe+UcVzdTJ2tmm1FmJ8cTQ2INa0cgspKUnbGO6dt9SlsYFTEKrLTO3YL3WNgNVthx3LkTdI41tFWu/u0pPVq9zrY1/Uce2XgkMOrjwpZPJLr4vqQbJeB/o2u/wsiPiMX1IeyXgY4ZXEa07x5I+IxeQ6cjS2LpZRj75JGlm4idmBHM6BcvqU49Cl7srEvmO9Mi8CjoImQJpADdKqUQPONoKvf7RyyXu2J4jHgOPrdfSaOG3Akck3ci82t9uxWd1rRsgEbB3ALSa+XgvE1u5NeglG5YSQ0AczwXj5k3Kj24SSjYSbHKCnGXfZ3dzRdPFossuexwZ9TF8Iz6vaWzHeywtLhwzu+S7YaBf1SOJ5fCMKpx/E6kFu93bTyjFvVdENNijzRLnJmac7nZnBxJ5m5XRwuxBrUVZIYoqYwZQ12Zzzz6KaQy9vExETIgAZkQBqWSGTiOV+vAggrLNDfDaioPa7LUL6GEA7vK7mTxXmz0mofub9WAR+J4bCAZZ2tBNuZWL0eoXsPqwIuxrBWtLjWsNuQBuoWk1D/pH1YlR+0+DMeMsU0ltcwjH5rZen6hruT1ojna3Bz/AHaf+RvzR+HajyHWiTi2nwmV4ayCe55ZAj8O1HlA88Sx9PYd+xk/lCPw3P5X7/QXXiMdosNb+pk8h80vw3P5X9/+B14g37U4YP1Mp+AT/DM/lD68SdPtLg8ps5xhP77PzWc/T9RH7gs0WGfjOC3B9vit0us1pNR9JXVj5I/TWC866I/A/JP4TUfSHVj5GOOYKP76z4NPyR8HqPpF1Y+QT8ewX/FE+EZVrR6jwHViCh2iwSmlkljlkL5AAf0Z4C/zVy0Womkmu33F1IBDtZhZ/Wyf+sqfw7N4DqxIu2qwz9q/+Qpr0/N4DqxBP2qw4NOV8hNtOwVcfT8t8i6sTiZpDJK+Q8XuLj8V7SVJI52bmBsZMZZDIxjsmU5jYeKmQ4g6muL2PgpQXxt7If39VgsC3bmdUtS9mxFCOjkdzt4LockclNlllC0e8L+KlzHRYZTtaOAAS3DUSRDRyS5CiNwOCpCGzpgMXpiIl6Yi/vn/ALQjwVEg3SvPFzvNMLBlyABSyR5CH6ju70rGZUrI8x3YcB1KQwRCAFZABYpnRA5NL80AO6eR3F3wQBAvd3oAYB54NcfAIAfI4cbDxQA1gPteSAG05DzKAGugBIASAFY9UASbG53AHyQBMU0nRKx0P7NJ080WgDxUpDCHkaqWyklRaja1rQ3kEmItwkC5PBY5DbF35ByPbm0VQTombV8EDIqolOiBeqSE2RLk6JIlyYCzC3FKynHgiXKiDacWn7I8kgBuDD9geSLCgT42n7IRuY6Beyxu94eqltjSIexRfd9UchQSPCBMf0dPI/wBTsKLcey8h7UsbIW98klkWwon9AYVD/zFdf8AdiBPqUWFCNLgEGjKOec98kpA8glbFQGU0p0goaeEfugk+ZKNzHRUfTxu43PxRuCgJpIT9lG4KImkh+76p2FETSRfdt8UWKhvZYu71TsKF7NF9z1SsY4gjHBoRYFuHDJ5Ax7aeRsbv1mQhoHffuWUs8FatX4KUG/Y6DG6TBaPCmto46d9S4tbvGOuRbiePPh8V5mkyanJmud7fB1Zo44w47nOWb3L1bOQgbJoCN0xDZkwFvXcilQWNnKdCsQfrqhoaE54t2Qkov3HJp9iN02wSIuPclbLpEblNIiTESqIOkZSVEv1cMjvBpSKDjCKwi7o2xjvkeAkAjQU8etRiEDejLuKBEb4RFzqJ/gGhAWL6Vpof+UoYWnvfdx9UDBS43WvFhLkHcwAIApSVMkhu+RxPUoAEZD3oAYvPekA2dADZ0ANmQMYu7kAQJPNAES5MQahppK6thpYfflNrng0cyfgs82RYoOcvYqEXOVI2azZeWipJKqorYjFEMzg1hu4dw14nguDF6nHLNQjF2zeemcI7m+C1PjDcap48HwuB8TpLAueRlDGi+tvALGGkelm9Rmd1/tlPN1UscUY9dg9ZRVFNAckz6m+63RuHW/3Xfi1ePLGUuyj3swlilFpd7LT9ma9r4Wb6mc6Z5YA15OoBJ5crLBeo4Wm6fBo9PLjnuCjwJ0swgjxTDXzE23bZrm/hZW9aox3OEkvyEsNulJGbPSTRYiaCzXziURWabguPD8V14prJBTj2ZjJbXTNqp2QlpKg09VjmDQzi145KnK4X4aWWlE2VMQ2YxOhxmHCQyOpqpmhzGwuuLd5uBZMRPGdlq7B8N9vlqKWeBsu6eYHl2R2vHTvFkAT/wCE62KngmxCvwvD9+3OyOqqcjyPCyADM2GxSSogihqsPmbO1z2SxTFzQBbU6dUADdsm5rC849g2UC5PtB+SW0vchT7Hz0u7FdjGEUkkjBII56jI7KediOiNoORRx/Z6rwEUzqqemmjqml0boHl1wLa8OGvFUQZCAOilxitk0dVSW7hp+CkCo+oe83e9zj1N0xgzJ1QBEyX5pARL0wGzpAMXoAbMgZK2lwVG4dAy6xVCFnToCJcgLFnsk0FjGS6SRW4gXKiLNjZvFKLC6mWoqmSveW5WbtoNr8efguLXafJngoQar3NsGSON3I6Csnm2rw0xYUN1EyQb10/ZzaXAFr9F5uLHH0/LuzcuuK/7R1SbzxqBgU1Q3Z2rxCKS0tbu91G+P3GEi/O3TyXo5IPWRhJcRu3ZyxksLkn3Cs2k3OC09NDEfboWGIVDgDkaT9nrayl6DdnlOT+V819yuu9iS7+S1FtRS0wYIaaW8FPu4cxHvHi52vOw9VjL07JK9z7u3/wpahLsuyK+H7UbmZ76uipvcIYaeLI4O7yb8Fpm9P3JKEn+rtUEdTT+ZFDZ/EabD9oIMRxGKSZkTnSWZqS88Dc+N16aSSpHKbsO3ckmMCprsMoH05eXOy04MtuXaJ48NeiYg8u21HTS1VbQ4XUTVFW4iaapkIDWcmNcLkeiPeg9rLEGKxvweTBp9nN2Jnb5kEE4eDYhxzZjdt/zWHxOKnK+DTpT8Acfr8FxcNxvE8MxQNMbADHURgBp93S9xfVWssHPYnyS4SS3FvCcQosKqJ/Y9n6mkNWxsEW4lY9ws0uJJJNna317go+Jxcu+xXSn4JS4uKyKKPJi745JG5oppoBvGNddwtobENIQ9TjV2wWKb7IDW7QYvVYuJfoKhfSOc3KZomOk3Wp97Nbk4o+JxfUCwz8HMbZYq7FtoJJWskiijY2NkTnh2TTW1iQNe5axkpK0Q006ZhKhF4vSAjnQAxegBZ0mUhF4SG6IlyogbOgBi9ACznvSoZHMmAsyAGzIAbMgBroAV0AK6AN/C9qZsLoGUkFFC4NuS4vILiTe50Xn6j06OfI5ykzox6hwjtSMOaV00z5pCS+Rxc4nvK74xUYpL2Odu3ZBMES4qSqQxCdiaGTEJAEzPKaf2fev3J13eY5b+CEoqW6uQt1V8Gm3aKtjqn1MMVJHNIQXvbDq+3I3J9O5c3wkHFRbbS7cmqzSTtFerxaqq6NlJKYxCwtLWsaQBYWA48PzWkMEISc49yZZJSVMtO2nxN7g+8AeCbOEdyASCeJtyA8FmtFhXHP9yuvPuDOP1LqhlS6mozNG0ta8xuuAb3HvdT5o+Fgo7bdP9+BdZ3dIm3aXERGGO3D2AEBrmHQFobbQ9PUo+Dxd+bH15mZWVMlZVy1M1t5I65yiwXRCChFRRlKTk7YFUIspAMgBkAJA0MUkNiTJGQAyAGQMSAGQAkAMgYkCEgBIASAEgB0AO1JjRJIbIFUSJADIEJACQAkAMgBJgJACQB//2Q=="

  }
];

const allGamesContainer = document.getElementById('allGamesContainer');
const searchInput = document.getElementById('searchInput');
const categoryBtns = document.querySelectorAll('.category-btn');
const noResults = document.getElementById('noResults');

let currentGenre = 'all';

const genreLabels = {
  action: 'アクション',
  racing: 'レーシング',
  casual: 'カジュアル',
  simulator: 'シミュレーター',
  iogame: 'ioゲーム',
  puzzle: 'パズル'
};

function getGenreLabel(genre) {
  return genreLabels[genre] || 'その他';
}

function createGameCard(game) {
  return `
    <a href="${game.path}" class="game-card" target="_blank" rel="noopener noreferrer" aria-label="${game.title}をプレイ">
      <div class="game-thumbnail" style="background-image: url('${game.thumb}');"></div>
      <div class="game-info">
        <h2 class="game-title">${game.title}</h2>
        <span class="game-genre">${getGenreLabel(game.genre)}</span>
        <div class="game-footer">
          <span class="game-meta">Play</span>
          <button class="play-button" type="button" aria-label="${game.title}を開始">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" fill="currentColor"></path>
            </svg>
          </button>
        </div>
      </div>
    </a>
  `;
}

function filterAndDisplayGames() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filtered = games.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm) ||
      getGenreLabel(game.genre).includes(searchTerm);

    const matchesGenre = currentGenre === 'all' || game.genre === currentGenre;

    return matchesSearch && matchesGenre;
  });

  if (filtered.length === 0) {
    allGamesContainer.innerHTML = '';
    noResults.style.display = 'flex';
    return;
  }

  noResults.style.display = 'none';

  if (currentGenre === 'all') {
    const grouped = {};
    Object.keys(genreLabels).forEach((genre) => {
      grouped[genre] = [];
    });

    filtered.forEach((game) => {
      if (grouped[game.genre]) {
        grouped[game.genre].push(game);
      }
    });

    let html = '';
    Object.entries(grouped).forEach(([genre, genreGames]) => {
      if (genreGames.length > 0) {
        html += `
          <div class="genre-section">
            <div class="genre-header">
              <h2 class="genre-title">${getGenreLabel(genre)}</h2>
              <div class="genre-divider"></div>
            </div>
            <div class="games-grid">
              ${genreGames.map(createGameCard).join('')}
            </div>
          </div>
        `;
      }
    });

    allGamesContainer.innerHTML = html;
  } else {
    const html = `
      <div class="genre-section">
        <div class="genre-header">
          <h2 class="genre-title">${getGenreLabel(currentGenre)}</h2>
          <div class="genre-divider"></div>
        </div>
        <div class="games-grid">
          ${filtered.map(createGameCard).join('')}
        </div>
      </div>
    `;
    allGamesContainer.innerHTML = html;
  }
}

searchInput.addEventListener('input', filterAndDisplayGames);

categoryBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentGenre = btn.dataset.genre;
    filterAndDisplayGames();
  });
});

filterAndDisplayGames();
