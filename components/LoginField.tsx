import {Input, InputField, Text, View } from '@gluestack-ui/themed';
import { useState } from 'react';


export default function LoginField(){
    const [text, setText] = useState('');
    return(
        <View>
         <Text>Skriv inn brukernavn</Text>
         <Input variant="rounded" size="md" isDisabled={false} isInvalid={false} isReadOnly={false} >
          <InputField
              placeholder='Username'
              onChangeText={newText => setText(newText)}
              defaultValue={text}
          />
        </Input>
        </View>
        );
      
}