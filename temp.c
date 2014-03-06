/** @file msort.c */
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>


typedef struct _threadst {
  int* start;
  int  size;
} threadst;

typedef struct _mergest {
  int* left;
  int* right;
  int lSet;
  int rSet;
} mergest;

//Yay quick compare:
int compare( const void* a, const void* b ) {
  if( *(int *)a < *(int *)b){
    return -1;
  }
  if( *(int *)a == *(int *)b){
    return 0;
  }
  if(*(int *)a > *(int *)b){
    return 1;
  }
}

void *m_sort(void* input){
  qsort((*(threadst*)input).start, (*(threadst*)input).size, sizeof(int), compare);
  fprintf(stderr, "Sorted %d elements.\n", (*(threadst*)input).size);
}

void *merge(void* input){

  int lSet = (*(mergest*)input).lSet;
  int rSet = (*(mergest*)input).rSet;

  int* left = malloc(sizeof(int) * lSet);
  int* right = malloc(sizeof(int) * rSet);

  int rC = 0, lC = 0;
  int i;
  int duplicates = 0;

  for(i = 0; i < lSet; i++){
    left[i] = *((*(mergest*)input).left + i);
  }

  for(i = 0; i < rSet; i++){
    right[i] = *((*(mergest*)input).right + i);
  }

  //Reset i:
  i = 0;

  while(rC < rSet || lC < lSet){
    if(rC < rSet && lC < lSet){
      if(l[lC] < r[rC]){
        *((*(mergest*)input).left + i) = left[lC];
        lC++;
      }else{
        *((*(mergest*)input).left + i) = right[rC];

        //Duplicate:
        if(l[lC] == r[rC]){
          duplicates++;
        }

        rC++;
      }
    }else if(lC < lSet){
      *((*(mergest*)input).left + i) = left[lC];
      lC++;
    }else if(rC < rSet){
      *((*(mergest*)input).left + i) = right[rC];
      rC++;
    }

    i++;
  }

  fprintf(stderr, "Merged %d and %d elements with %d duplicates.\n", lSet, rSet, duplicates);

  free(l);
  free(r);
}

int main(int argc, char **argv)
{
        int  *input;
        int  *resize;
        int  *last;
        int   segval;
        int   input_size = 1024;
        int   count      = 0;
        int   temp_segs  = 0;
        int   halves     = 0;
        int   i;
        int   num_per_seg;
        char  temp_str[64];
        char  odd = 0;
        threadst *param;
        mergest  *m_p;
        pthread_t *threads;

        // printf( "%c\n", *argv[1] );
        input  = malloc( sizeof(int) * input_size );
        segval = atoi( argv[1] );

        while( fgets( temp_str, 64, stdin ) ) {

                if( count == ( input_size - 1 ) ) {
                        resize = malloc( sizeof(int) * input_size * 2 );

                        for( i = 0; i < input_size; i++ )
                                resize[i] = input[i];

                        free( input );
                        input  = resize;
                        resize = NULL;
                        input_size *= 2;
                }

                input[count] = strtol( temp_str, NULL, 10 );
                count++;
        }

        if (count % segval == 0 || ((count / segval) + 1)*(segval-1) > count ) {
        num_per_seg = count / segval;
        if( count % segval != 0 )
                odd = 1;
   }
        else {
        num_per_seg = (count / segval) + 1;
   }

   temp_segs = segval;
        threads = malloc( temp_segs * sizeof( pthread_t ) );
        param   = malloc( temp_segs * sizeof( threadst ) );

        for( i = 0; i < temp_segs - 1; i++ ) {
                param[i].size  = num_per_seg;
                param[i].start = &input[i*num_per_seg];
                pthread_create( &threads[i], NULL, m_sort, &param[i] );
        }
        param[i].size  = count - i*num_per_seg;
        param[i].start = &input[(temp_segs-1)*num_per_seg];
        pthread_create( &threads[i], NULL, m_sort, &param[i] );
        last = param[i].start;

        for( i = 0; i < temp_segs; i++ )
                pthread_join(threads[i], NULL);

        m_p = malloc( sizeof( mergest ) * temp_segs );
        halves = 2;


        while( temp_segs != 1 ) {

                temp_segs /= 2;

                for( i = 0; i < temp_segs; i++ ) {
                        m_p[i].ls = num_per_seg;
                        if( ((i*2*num_per_seg)+(num_per_seg*2)) > count || ((((i*2*num_per_seg)+(num_per_seg*2)) < count) && i == temp_segs -1 && segval % 2 == 0 ) ) {
                                m_p[i].rs = count - (num_per_seg*(i*2+1));
                                odd = 0;
                        }
                        else {
                                m_p[i].rs = num_per_seg;
                        }
                        m_p[i].l  = (input + num_per_seg*i*2);
                        m_p[i].r  = (m_p[i].l + m_p[i].ls);
                        pthread_create( &threads[i], NULL, merge, &m_p[i] );
                }

                for( i = 0; i < temp_segs; i++ ) {
                        pthread_join( threads[i], NULL );
                }

                if( temp_segs % 2 != 0 && temp_segs != 1 ) {
                        m_p[0].ls = num_per_seg*2;
                        m_p[0].rs = count - num_per_seg*(temp_segs)*2;
                        m_p[0].l  = input+(num_per_seg*(temp_segs-1)*2);
                        m_p[0].r  = last;
                        merge( m_p );
                        last = m_p[0].l;
                }

                num_per_seg *= 2;
        }

        if( ( segval % 2 != 0 || odd ) ) {
                m_p[0].ls = num_per_seg;
                m_p[0].rs = count - num_per_seg;
                m_p[0].l  = input;
                m_p[0].r  = last;
                merge( m_p );
        }

        for( i = 0; i < count; i++ ) {
                printf( "%d\n", input[i] );
        }

        free( m_p );
        free( threads );
        free( param );
        free( input );

        return 0;
}
