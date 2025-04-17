import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
// import { useNavigation } from "@react-navigation/native";
// import Icon from 'react-native-vector-icons/Feather';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Entypo from 'react-native-vector-icons/Entypo';

// import { useDispatch, useSelector } from "react-redux";
// import { setToken } from "../redux/slices/modal";
// import { setUser } from "../redux/slices/user";
// Replace with actual memberstack logic or API calls
// import { memberstack } from "../utils/memberstack";
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};
const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // const toast = useToast
  //   const navigation = useNavigation();
  //   const dispatch = useDispatch();

  const handleLogin = async () => {
    // if (!email || !password) {
    //   Alert.alert("Validation Error", "Please fill in all fields");
    //   return;
    // }

    setLoading(true);
    try {
      if (email === 'test@member.com' && password === '1234') {
        navigation.push('Home');
      } else {
        //   toast
      }
      //   const res = await memberstack?.loginMemberEmailPassword({
      //     email,
      //     password,
      //   });
      //   if (res?.data?.member?.verified) {
      //     dispatch(setToken(res.data.tokens.accessToken));
      //     dispatch(setUser(res.data.member));
      //     navigation.navigate("Home");
      //   }
    } catch (err) {
      //   Alert.alert("Login Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithProvider = async (provider: 'google' | 'linkedin') => {
    setLoading(true);
    try {
      //   const res = await memberstack?.loginWithProvider({ provider });
      //   if (res?.data?.member?.verified) {
      //     dispatch(setToken(res.data.tokens.accessToken));
      //     dispatch(setUser(res.data.member));
      //     navigation.navigate("Home");
      //   }
    } catch (err) {
      //   Alert.alert("Login Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/blaze/blaze-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Login to your account</Text>

      <TextInput
        placeholder="Email Address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}>
          {/* <Icon
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#888"
          /> */}
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, (!email || !password) && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={!email || !password}>
        <Text style={styles.buttonText}>Log in</Text>
        {loading && (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={{marginLeft: 10}}
          />
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      <TouchableOpacity
        style={styles.socialButton}
        onPress={() => loginWithProvider('google')}>
        <Text style={styles.socialText}>
          {' '}
          {/* <AntDesign name={'google'} size={20} color="#888" /> */}
          Continue with Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialButton}
        onPress={() => loginWithProvider('linkedin')}>
        <Text style={styles.socialText}>
          {' '}
          {/* <Entypo name={'linkedin'} size={20} color="#888" /> */}
          Continue with LinkedIn
        </Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        Don't have an account?
        <Text style={styles.signupLink}> Sign up here</Text>
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    color: '#000',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 22,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#3b82f6',
    fontSize: 13,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#6b7280',
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  socialText: {
    color: '#000',
  },
  signupText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6b7280',
  },
  signupLink: {
    color: '#3b82f6',
    fontWeight: '500',
  },
});
