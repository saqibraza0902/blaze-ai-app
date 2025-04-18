import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomPicker from '../custom-picker'; // Adjust the path as needed
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {setConvoSettings} from '../../redux/slices/modal';
import {CasecadeItems, Delays, NEWMODELS} from '../../mock';
import CustomCheckbox from '../check-box';
import {ScrollView} from 'react-native';
import AiICon from '../../ui/icons/ai-icon';
import AiIcon from '../../ui/icons/ai-icon';
import Svg, {ClipPath, Defs, G, Path} from 'react-native-svg';
import GeneralIcon from '../../ui/icons/general-icon';
import { get_conversation_setting } from '../../utils/functions';
import { handleApiError } from '../../utils/error';

const IdeaHubSetting = () => {
  const dispatch = useAppDispatch();
  const {conversation_setting, token} = useAppSelector(s => s.modal);
  const {cascade, delay, mode, models} = conversation_setting;
  const [isChecked, setIsChecked] = useState(false);
  const [selectedModels, setSelectedModels] = useState<{
    [key: string]: string | null;
  }>({});
  const [checkedState, setCheckedState] = useState<{[key: string]: boolean}>(
    {},
  );
  const handleSelect = (selectedItem: any, index: number) => {
    dispatch(
      setConvoSettings({
        key: 'cascade',
        value: selectedItem.value,
      }),
    );
  };
  const handleSelectDelay = (selectedItem: any, index: number) => {
    dispatch(
      setConvoSettings({
        key: 'delay',
        value: selectedItem.value,
      }),
    );
  };

  const handleSelectChange = (aiTitle: string, value: string) => {
    setSelectedModels(prev => ({...prev, [aiTitle]: value}));
  };

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const myid = id || '';
  //       const res = await get_conversation_setting(token, myid);
  //       console.log(res);
  //       if (res && id) {
  //         // console.log("this fucking shit shouldnt run ", id, res);
  //         // Only update the state if the values are different
  //         if (res.delay_seconds !== conversation_setting.delay) {
  //           dispatch(
  //             setConvoSettings({
  //               key: 'delay',
  //               value: res?.delay_seconds,
  //             }),
  //           );
  //         }

  //         if (res.max_cascade !== conversation_setting.cascade) {
  //           dispatch(
  //             setConvoSettings({
  //               key: 'cascade',
  //               value: res?.max_cascade,
  //             }),
  //           );
  //         }

  //         if (
  //           JSON.stringify(res.models_present) !==
  //           JSON.stringify(conversation_setting.models)
  //         ) {
  //           dispatch(
  //             setConvoSettings({
  //               key: 'models',
  //               value: res.models_present,
  //             }),
  //           );
  //           dispatch(
  //             setConvoSettings({
  //               key: 'mode',
  //               value: res.conversation_type,
  //             }),
  //           );
  //         }

  //         const updatedCheckedState: any = {};
  //         const updatedSelectedModels: any = {};

  //         // Check if the model is selected from the API
  //         NEWMODELS.forEach(item => {
  //           let isChecked = false;
  //           let selectedModel = null;

  //           for (let i = 0; i < item.models.length; i++) {
  //             if (res.models_present.indexOf(item.models[i].value) !== -1) {
  //               isChecked = true;
  //               selectedModel = item.models[i];
  //               break;
  //             }
  //           }

  //           updatedCheckedState[item.title] = isChecked;
  //           updatedSelectedModels[item.title] = selectedModel?.value;
  //         });
  //         if (id !== null || id) {
  //           setCheckedState(prev => {
  //             return {...prev, ...updatedCheckedState};
  //           });

  //           setSelectedModels(prev => {
  //             return {...prev, ...updatedSelectedModels};
  //           });
  //         }
  //       }
  //     } catch (error) {
  //       const err = handleApiError(error);
  //       toast.error(err);
  //     }
  //   };
  //   if (id) {
  //     getData();
  //   }
  // }, [id, dispatch]);

  // useEffect(() => {
  //   if (!id) {
  //     // Reset states when there is no id
  //     setSelectedModels({});
  //     setCheckedState({});
  //     dispatch(
  //       setConvoSettings({
  //         key: 'cascade',
  //         value: 0, // or any default value
  //       }),
  //     );
  //     dispatch(
  //       setConvoSettings({
  //         key: 'delay',
  //         value: 0, // or any default value
  //       }),
  //     );
  //     dispatch(
  //       setConvoSettings({
  //         key: 'models',
  //         value: [Models.Blaze], // Clear the models list
  //       }),
  //     );
  //   }
  // }, [id, dispatch]);
  // const handleSelectChange = (title: string, value: string) => {
  //   setSelectedModel(value);
  // };
  // const updateConversationSetting = async () => {
  //   try {
  //     const datatosend = {
  //       conversation_id: id || '',
  //       max_cascade:
  //         conversation_setting.cascade === 0 ? 3 : conversation_setting.cascade,
  //       delay_seconds:
  //         conversation_setting.delay === 0 ? 0 : conversation_setting.delay,
  //     };
  //     const res = await update_conversation_setting(token, datatosend);
  //     console.log(datatosend, res);

  //     toast.success(res.message);
  //   } catch (error) {
  //     const err = handleApiError(error);
  //     toast.error(err);
  //   }
  // };

  // const dispatchSelectedModels = (ai: AI) => {
  //   setCheckedState(prev => {
  //     const isChecked = !prev[ai.title];

  //     // If unchecked, remove the model
  //     if (!isChecked) {
  //       setSelectedModels(prevModels => {
  //         const updatedModels = {...prevModels};
  //         delete updatedModels[ai.title];
  //         return updatedModels;
  //       });

  //       dispatch(
  //         setConvoSettings({
  //           key: 'models',
  //           value: models.filter(
  //             model => !ai.models.some(m => m.value === model),
  //           ), // Remove the model from Redux
  //         }),
  //       );
  //     } else {
  //       let modelToDispatch = selectedModels[ai.title] || ai.models[0].value; // Default to the first model if none selected

  //       // Update the selected model in local state
  //       setSelectedModels(prev => ({
  //         ...prev,
  //         [ai.title]: modelToDispatch,
  //       }));

  //       // Add the model to Redux if not already in the list
  //       const updatedModels = [...models];
  //       // @ts-ignore
  //       if (!updatedModels.includes(modelToDispatch)) {
  //         // @ts-ignore
  //         updatedModels.push(modelToDispatch);
  //       }

  //       dispatch(
  //         setConvoSettings({
  //           key: 'models',
  //           value: updatedModels,
  //         }),
  //       );
  //     }

  //     return {...prev, [ai.title]: isChecked}; // Update checkbox state
  //   });
  // };
  const handleCheckboxToggle = (title: string) => {
    setCheckedState(prevState => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };
  console.log('Selction', selectedModels);
  console.log('Checked State', checkedState);
  return (
    <View style={{paddingBottom: 60}}>
      <View>
        <Text style={{fontSize: 25, color: 'white', textAlign: 'center'}}>
          I.D.E.A. Hub
        </Text>
      </View>
      {/* _____________CaseCade____________ */}
      <View style={{paddingHorizontal: 20, marginTop: 30}}>
        <CustomPicker
          data={CasecadeItems}
          onSelect={handleSelect}
          buttonTextAfterSelection={selectedItem =>
            selectedItem ? ` ${selectedItem.label}` : `${cascade}`
          }
          rowTextForSelection={item => item.label}
          defaultButtonText={cascade ? ` ${cascade}` : 'Max messages'}
        />
      </View>
      {/* __________-Delaysssss________________ */}
      <View style={{paddingHorizontal: 20, marginVertical: 15}}>
        <CustomPicker
          data={Delays}
          onSelect={handleSelectDelay}
          buttonTextAfterSelection={selectedItem =>
            selectedItem ? ` ${selectedItem.label}` : `${delay}`
          }
          rowTextForSelection={item => item.label}
          defaultButtonText={delay ? ` ${delay}` : 'Delay '}
        />
      </View>
      {/* _________Balze Max Cordinator _____________ */}
      <View>
        <View style={styles.Textcontainer}>
          <Text style={styles.text}>Blaze Max (Coordinator)</Text>
        </View>
        <View style={[styles.line]} />
        <View style={styles.container}>
          {NEWMODELS.map((item, index) => (
            <View key={index} style={styles.modelContainer}>
              {/* Power Label */}

              {/* Custom Checkbox */}
              <View style={{flexDirection: 'row', gap: 20}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}>
                  <CustomCheckbox
                    checked={checkedState[item.title] || false}
                    onToggle={() => handleCheckboxToggle(item.title)}
                    size={30}
                    fillColor="white"
                    borderColor="#888"
                    borderWidth={2}
                    style={{borderRadius: 6}}
                    duration={300}
                  />

                  <View>
                    <Image
                      source={require('../../../assets/images/blaze/ai.png')}
                      style={{
                        width: 30,
                        height: 30,
                      }}
                    />
                  </View>
                </View>

                {/* Select Dropdown for Power Group */}
                <View style={{flex: 1}}>
                  <View style={styles.powerLabelContainer}>
                    <Text style={styles.powerLabelText}>
                      Powered by {item.title}
                    </Text>
                  </View>

                  <CustomPicker
                    data={item.models}
                    onSelect={(selectedItem, index) =>
                      handleSelectChange(item.title, selectedItem.value)
                    }
                    rowTextForSelection={item => item.title}
                    buttonStyle={styles.dropdownButton}
                    buttonTextStyle={styles.dropdownButtonText}
                    dropdownStyle={styles.dropdown}
                    defaultButtonText="Select Model"

                    // disabled={checkboxState[item.title]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default IdeaHubSetting;

const styles = StyleSheet.create({
  Textcontainer: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#06b6d4',
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  text: {
    fontSize: 14,
    color: 'white',
  },
  line: {
    width: 1,
    height: 60, // h-20 = 5rem = 80px
    alignSelf: 'center',
    backgroundColor: '#FFFFFF', // justify-center equivalent in RN for single element
  },
  container: {
    marginHorizontal: 15,
    paddingTop: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#06b6d4',
    borderStyle: 'solid',
    borderRadius: 50,
  },
  modelContainer: {
    marginBottom: 20,
  },
  powerLabelContainer: {
    backgroundColor: '#1E1E1E',
    // paddingVertical: 12,
    // paddingHorizontal: 16,
    borderRadius: 12,
    borderColor: 'white',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    paddingBottom: 30,
    paddingTop: 10,
    marginBottom: -6,
  },
  powerLabelText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  dropdownButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  dropdownButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  dropdown: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
  },
  dropdownRow: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownRowText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
});
