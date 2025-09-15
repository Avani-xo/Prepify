// Online C compiler to run C program online
#include <stdio.h>

int main() {
    int i,j,k;
    char ch;
    for(i=0;i<=10;i++)
    {
        for(k=0;k<=10-i;k++)
        {
            printf(" ");
        }
        ch='A';
             for(j=0;j<=2*i;j++)
             {
                 printf("%c",&ch);
                 ch++;
             }
             printf("\n");  
    
                     

    }
    return 0;
}