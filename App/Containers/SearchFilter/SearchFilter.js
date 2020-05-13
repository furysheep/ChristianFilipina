import React, { Fragment } from 'react'
import { Modal, View, TouchableHighlight, ScrollView } from 'react-native'
import { ButtonGroup, ListItem, Button, Text, Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import Picker from 'react-native-picker'
import Dialog from 'react-native-dialog'
import firebase from 'react-native-firebase'

import styles from './SearchFilterStyle'
import { Images, Helpers, Colors } from 'App/Theme'
import SearchActions from 'App/Stores/Search/Actions'
import { countryNames, countryNameFromCode, countryCodeFromName } from 'App/Config/Countries'

class SearchFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: 0,
      isPickerShowing: false,
      dialogVisible: false,
      dialogForName: '',
      dialogKey: '',
      dialogCurrentValue: '',
      questions: [],
      basic: props.isBasic,
      questionValues: {},
      savedSearches: [],
    }
  }

  componentDidMount() {
    this.props.searchQuestions()
    this.props.getSavedSearches()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const update = {}
    if (nextProps.questions !== prevState.questions) {
      update.questions = nextProps.questions
    }

    if (nextProps.questionValues !== prevState.questionValues) {
      update.questionValues = nextProps.questionValues
    }

    if (nextProps.savedSearches !== prevState.savedSearches) {
      update.savedSearches = nextProps.savedSearches
    }

    return Object.keys(update).length ? update : null
  }

  updateIndex = (selectedIndex) => {
    Picker.hide()
    this.setState({ selectedIndex })
  }

  showPicker = (data, selectedValue, pickerTitleText, question) => {
    Picker.init({
      pickerFontFamily: 'Arial',
      pickerTextEllipsisLen: 20,
      pickerData: data,
      selectedValue: [selectedValue],
      onPickerConfirm: (data) => {
        if (data[0] === 'Any') {
          const { questionValues } = this.state
          delete questionValues[question.question_name_for_search[0]]
          this.props.searchQuestionValuesUpdate(questionValues)
        } else if (question.question_type[0] === 'country') {
          this.props.searchQuestionValuesUpdate({
            ...this.state.questionValues,
            [question.question_name_for_search[0]]: countryCodeFromName(data[0]),
          })
        } else if (question.question_options) {
          this.props.searchQuestionValuesUpdate({
            ...this.state.questionValues,
            [question
              .question_name_for_search[0]]: question.question_options[0].question_option.filter(
              (option) => option.option_label[0] === data[0]
            )[0].option_id[0],
          })
        } else {
          this.props.searchQuestionValuesUpdate({
            ...this.state.questionValues,
            [question.question_name_for_search[0]]: data[0],
          })
        }
        this.hidePicker()
      },
      onPickerCancel: (data) => this.hidePicker(),
      onPickerSelect: (data) => {},
      pickerConfirmBtnText: 'Confirm',
      pickerCancelBtnText: 'Cancel',
      pickerTitleText,
    })
    // this.setState({ isPickerShowing: true })
    Picker.show()
  }

  hidePicker = () => {
    Picker.hide()
    this.setState({ isPickerShowing: false })
  }

  componentDidUpdate() {
    // if (this.state.isPickerShowing) {
    //   if (!Picker.isPickerShow()) Picker.show()
    // }
  }

  componentWillUnmount() {
    Picker.hide()
  }

  confirmDialog = () => {
    const { dialogCurrentValue, dialogKey } = this.state
    this.props.searchQuestionValuesUpdate({
      ...this.state.questionValues,
      [dialogKey]: dialogCurrentValue,
    })
    this.setState({ dialogVisible: false })
  }

  hideDialog = () => {
    this.setState({ dialogVisible: false })
  }

  loadSavedSearch = (searchName) => {
    firebase.analytics().setCurrentScreen('SavedSearches', 'SavedSearches')
    this.props.setSavedSearch(searchName)
    this.props.navigation.navigate('OnlineUsers')
  }

  render() {
    const buttons = ['New Search', 'Saved Searches']
    const {
      selectedIndex,
      questions,
      basic,
      questionValues,
      dialogCurrentValue,
      dialogForName,
      dialogVisible,
      savedSearches,
    } = this.state

    const filtered = questions.filter(
      (question) => (basic && question.question_basic_advanced[0] === 'basic') || !basic
    )
    return (
      <View style={styles.container}>
        <Dialog.Container visible={dialogVisible}>
          <Dialog.Title>{`Please enter a value for ${dialogForName}`}</Dialog.Title>
          <Dialog.Input
            textInputRef={(ref) => {
              this.input = ref
            }}
            value={dialogCurrentValue}
            onChangeText={(dialogCurrentValue) => this.setState({ dialogCurrentValue })}
            wrapperStyle={styles.dialogInput}
          />
          <Dialog.Button label="Ok" onPress={this.confirmDialog} />
          <Dialog.Button label="Cancel" onPress={this.hideDialog} />
        </Dialog.Container>
        {/* <Modal
          animationType="fade"
          backdropOpacity={0.2} // show modal and picker instantly to avoid undue delay, since picker can't show till after modal is showing
          visible={this.state.isPickerShowing}
          onRequestClose={this.hidePicker}
          transparent={true}
          onShow={() => {
            Picker.show()
          }}
        >
          <TouchableHighlight style={styles.modal} onPress={this.hidePicker}>
            <View />
          </TouchableHighlight>
        </Modal> */}

        <ButtonGroup onPress={this.updateIndex} selectedIndex={selectedIndex} buttons={buttons} />
        {selectedIndex === 0 ? (
          <ScrollView style={styles.scrollView}>
            {!basic && <Text style={styles.sectionHeader}>Basic Options</Text>}
            {filtered.map((question, index) => {
              const props = {}

              if (question.question_type[0] === 'country') {
                props.rightTitle = countryNameFromCode(
                  questionValues[question.question_name_for_search[0]]
                )
              } else if (question.question_type[0] === 'text') {
                props.rightTitle = questionValues[question.question_name_for_search[0]] || ''
              } else if (
                question.question_type[0] === 'age' ||
                question.question_type[0] === 'select' ||
                question.question_type[0] === 'radio'
              ) {
                if (questionValues[question.question_name_for_search[0]]) {
                  if (question.question_options) {
                    props.rightTitle = question.question_options[0].question_option.filter(
                      (option) =>
                        option.option_id[0] === questionValues[question.question_name_for_search[0]]
                    )[0].option_label[0]
                  } else {
                    props.rightTitle = questionValues[question.question_name_for_search[0]]
                  }
                } else {
                  props.rightTitle = 'Any'
                }
              }

              if (question.question_type[0] !== 'switch' && question.question_type[0] !== 'text') {
                props.rightIcon = <Icon name="chevron-right" color={Colors.separator} />
              } else if (question.question_type[0] === 'switch') {
                props.switch = {
                  value: !!questionValues[question.question_name_for_search[0]],
                  onValueChange: (value) => {
                    this.props.searchQuestionValuesUpdate({
                      ...this.state.questionValues,
                      [question.question_name_for_search[0]]: value ? 1 : 0,
                    })
                  },
                }
              }

              return (
                <Fragment key={index}>
                  {index > 0 &&
                    question.question_basic_advanced[0] === 'advanced' &&
                    filtered[index - 1].question_basic_advanced[0] === 'basic' && (
                      <Text style={styles.sectionHeader}>Advanced Options</Text>
                    )}
                  <ListItem
                    title={question.question_label[0]}
                    {...props}
                    onPress={() => {
                      if (props.switch) {
                        return
                      }
                      if (question.question_type[0] === 'text') {
                        this.setState({
                          dialogForName: question.question_label[0],
                          dialogKey: question.question_name_for_search[0],
                          dialogVisible: true,
                          dialogCurrentValue: questionValues[question.question_name_for_search[0]],
                        })
                        setTimeout(() => {
                          if (this.input) this.input.focus()
                        }, 500)

                        return
                      }

                      let data = []
                      if (
                        question.question_basic_advanced[0] === 'advanced' &&
                        (question.question_type[0] === 'select' ||
                          question.question_type[0] === 'radio')
                      ) {
                        data.push('Any')
                      }
                      if (question.question_options) {
                        data = data.concat(
                          question.question_options[0].question_option.map((o) => o.option_label[0])
                        )
                      } else if (question.question_type[0] === 'age') {
                        for (var i = 18; i <= 80; i++) {
                          data.push(String(i))
                        }
                      } else if (question.question_type[0] === 'country') {
                        data = data.concat(countryNames)
                        this.showPicker(
                          data,
                          countryNameFromCode(questionValues[question.question_name_for_search[0]]),
                          'Country',
                          question
                        )
                        return
                      }

                      this.showPicker(
                        data,
                        questionValues[question.question_name_for_search[0]]
                          ? question.question_options
                            ? question.question_options[0].question_option.filter(
                                (option) =>
                                  option.option_id[0] ===
                                  questionValues[question.question_name_for_search[0]]
                              )[0].option_label[0]
                            : questionValues[question.question_name_for_search[0]]
                          : 'Any',
                        question.question_label[0],
                        question
                      )
                    }}
                    bottomDivider
                  />
                </Fragment>
              )
            })}

            {/* <ListItem
              key={1}
              title={'Age From:'}
              rightTitle={'18'}
              rightIcon={<Icon name="chevron-right" color={Colors.separator} />}
              bottomDivider
            />
            <ListItem
              key={2}
              title={'Age Up To:'}
              rightTitle={'25'}
              rightIcon={<Icon name="chevron-right" color={Colors.separator} />}
              bottomDivider
            />
            <ListItem key={3} title={'with photo only?'} switch={{ value: true }} /> */}
            <View style={styles.buttons}>
              <Button
                title={basic ? 'Power Search' : 'Basic Search'}
                buttonStyle={styles.powerSearch}
                onPress={() => {
                  Picker.hide()
                  this.setState({ basic: !basic }, () => {
                    this.props.searchBasicUpdate(this.state.basic)
                  })
                }}
              />
              <Button
                title="Search"
                buttonStyle={styles.search}
                onPress={() => {
                  Picker.hide()
                  const screen = basic ? 'BasicUserSearch' : 'AdvancedUserSearch'
                  firebase.analytics().setCurrentScreen(screen, screen)
                  this.props.setCustomSearch(true)
                  this.props.navigation.navigate('OnlineUsers')
                }}
              />
            </View>
          </ScrollView>
        ) : savedSearches.length > 0 ? (
          <ScrollView>
            {savedSearches.map((searchName, index) => (
              <ListItem
                key={index}
                title={searchName}
                onPress={this.loadSavedSearch.bind(this, searchName)}
                bottomDivider
              />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noResults}>No saved searches yet</Text>
        )}
      </View>
    )
  }
}

SearchFilter.propTypes = {
  questions: PropTypes.array,
  questionValues: PropTypes.object,
  searchQuestions: PropTypes.func,
  searchQuestionValuesUpdate: PropTypes.func,
  searchBasicUpdate: PropTypes.func,
  isBasic: PropTypes.bool,
  setCustomSearch: PropTypes.func,
  setSavedSearch: PropTypes.func,
  getSavedSearches: PropTypes.func,
  savedSearches: PropTypes.array,
  navigation: PropTypes.object,
}

const mapStateToProps = (state) => ({
  questions: state.search.questions,
  questionValues: state.search.questionValues,
  isBasic: state.search.isBasic,
  savedSearches: state.search.savedSearches,
})

const mapDispatchToProps = (dispatch) => ({
  searchQuestions: () => dispatch(SearchActions.searchQuestions()),
  searchQuestionValuesUpdate: (questionValues) =>
    dispatch(SearchActions.searchQuestionValuesUpdate(questionValues)),
  searchBasicUpdate: (isBasic) => dispatch(SearchActions.searchBasicUpdate(isBasic)),
  setCustomSearch: (isCustomSearch) => dispatch(SearchActions.setCustomSearch(isCustomSearch)),
  setSavedSearch: (searchName) => dispatch(SearchActions.setSavedSearch(searchName)),
  getSavedSearches: () => dispatch(SearchActions.getSavedSearches()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchFilter)
