import React from 'react'
import { Text, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native'
import { useAuthAction } from '../actions/useAuthAction'
import { useBackButton } from '../device/useBackButton'
import { object, string } from 'yup'
import { FormikProps, Formik, FormikHelpers } from 'formik'
import { SafeAreaView } from 'react-navigation'
import { PageProps } from './interface'
import { TextInputFormik } from '~/components/form/Input'
import { useFocus } from '~/useFocus'
import { colors } from '~/style/cores'
import { Buttonperson } from '~/components/Button'

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

const validation = object().shape({
  email: string()
    .email('Email inválido')
    .required('Email inválido'),

  password: string()
    .min(6, 'Senha deve conter no minimo 6 caracteres')
    .required('Senha deve conter no minimo 6 caracteres'),

  confirmPassword: string()
    .required('senhas não conferem')
    .test('compare', 'senhas não conferem',
      function (confirmPassword) {
        return confirmPassword === this.parent.password
      })
})

export function Register ({ navigation }: PageProps) {
  useBackButton(() => navigation.goBack(null))
  const token = navigation.getParam('codigo')
  const email = navigation.getParam('email')

  const { registerWithDevice, loading, error, registerWithInvite } = useAuthAction()

  const [passwordRef, setPasswordFocus] = useFocus<TextInput>()
  const [password2Ref, setPassword2Focus] = useFocus<TextInput>()

  const initialValues: RegisterForm = {
    confirmPassword: '',
    email: email || '',
    password: ''
  }

  function RegisterForm (props: FormikProps<RegisterForm>) {
    const handleSubmit = ev => props.handleSubmit(ev)

    if (props.isSubmitting) return <SafeAreaView style={styles.loading}><ActivityIndicator size="large" color={colors.fl} /></SafeAreaView>

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.inner}>
          <View style={{ flex: 1 }} />
          {/* <StatusBar barStyle="light-content" translucent={true} backgroundColor={colors.vrdesc} /> */}
          <Text style={{ color: colors.claro }}>{error}</Text>
          <TextInputFormik
            autoFocus={false}
            textContentType="emailAddress"
            placeholder="email"
            name="email"
            onSubmitEditing={setPasswordFocus}
            blurOnSubmit={false}
            returnKeyType="next"
            editable={!email}
          />

          <TextInputFormik
            inputRef={passwordRef}
            textContentType="password"
            secureTextEntry={true}
            placeholder="password"
            name="password"
            onSubmitEditing={setPassword2Focus}
            blurOnSubmit={false}
            returnKeyType="next"
          />
          <TextInputFormik
            inputRef={password2Ref}
            textContentType="password"
            secureTextEntry={true}
            placeholder="confirm password"
            name="confirmPassword"
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
            blurOnSubmit={props.isValid}
          />
          <Buttonperson onPress={handleSubmit} styleButton={styles.botao}>Cadastrar</Buttonperson>

          <View style={{ flex: 1 }} />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    )
  }

  async function submit (values: RegisterForm, props: FormikHelpers<RegisterForm>) {
    try {
      const res = token
        ? await registerWithDevice(values.email, values.password, token)
        : await registerWithInvite(values.email, values.password)
      if (res) {
        navigation.navigate('App')
      } else {
        props.setSubmitting(false)
      }
    } catch (err) {
      props.setSubmitting(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validation}
        onSubmit={submit}
        render={RegisterForm}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: colors.escr
  },
  botao: {
    flexShrink: 1
  },
  inner: {
    flex: 1,
    backgroundColor: colors.escr,
    justifyContent: 'flex-end'
  },
  loading: {
    flex: 1,
    backgroundColor: colors.escr,
    justifyContent: 'center'
  }
})
