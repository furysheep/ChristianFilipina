import { StyleSheet } from 'react-native'
import { Fonts, Helpers, Metrics, Colors } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  scrollView: {
    ...ApplicationStyles.screen.container,
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Metrics.largeMargin,
  },
  row: {
    ...Helpers.row,
    paddingVertical: Metrics.smallMargin,
  },
  fill: {
    ...Helpers.fill,
  },
  benefitItem: {
    ...Helpers.fill,
    ...Helpers.rowCross,
  },
  productContainer: {
    borderRadius: Metrics.smallMargin,
    backgroundColor: 'white',
    overflow: 'hidden',
    marginBottom: Metrics.baseMargin,
  },
  productTitle: {
    backgroundColor: Colors.destructive,
    color: 'white',
    padding: Metrics.smallMargin,
    textAlign: 'center',
  },
  productPrice: {
    fontWeight: 'bold',
    textAlign: 'center',
    padding: Metrics.smallMargin,
  },
  productDesc: {
    textAlign: 'center',
    padding: Metrics.smallMargin,
  },
})
