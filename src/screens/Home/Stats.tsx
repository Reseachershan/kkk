import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';
import KlimbStatsIcon from '../../components/aplicationIcons/KlimbStatsIcon';
import TabLabels from '../../components/TabLabels';
import KlimbLogsModal from '../../components/KlimbLogsModal';
import { getTimeFormat } from '../../hooks/useTracker';
import useUser from '../../hooks/useUser';
import {
  observerAnalyticWorkoutById,
  observerMonthsAnalyticWorkoutByYear,
} from '../../services/analytics';
import { workOutType } from '../../types/workout';
const { width } = Dimensions.get('screen');
interface dashboardGridsType {
  id: number;
  title: string;
  value: any;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  background: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  header: {
    marginTop: 39,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  dashboardGrids: {
    marginTop: 5,
    paddingHorizontal: 8,
  },
  gridValue: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 21,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  body: {
    marginTop: 12,
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  chartTitleText: {
    marginTop: 12,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 17.46,
    color: '#414141',
    paddingHorizontal: 21,
  },
  button: {
    height: 37,
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  buttonLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 16.3,
    color: '#979696',
  },
  dropdownStyle: {
    borderWidth: 1,
    borderColor: '#A79C9C',
    borderRadius: 6,
  },
  rowStyle: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 18.62,
    color: '#979696',
  },
  smallText: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 21,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

const chartConfig = {
  backgroundGradientFrom: 'rgba(4, 96, 52, 0.3)',
  backgroundGradientTo: 'rgba(184, 255, 70, 0)',
  strokeWidth: 1,

  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional

  backgroundColor: '#fff',
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(4, 96, 52, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(69, 68, 89, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForBackgroundLines: {
    strokeWidth: 1,
  },
};

const workoutOptions: any[] = ['Single Workout', 'Double Workout'];
const Stats = () => {
  const [workOutType, setWorkOutType] = useState<any>('Single Workout');
  const [dateFilter, setDateFilter] = useState('year');
  const [logsOpen, setLogsOpen] = useState(false);
  const [analytic, setAnalytic] = useState<any>(null);
  const dateFilterArray = [
    { id: 'week', name: 'Week' },
    { id: 'month', name: 'Month' },
    { id: 'year', name: 'Year' },
    { id: 'all', name: 'Max' },
  ];

  const { user } = useUser();
  useEffect(() => {
    if (!user?.uid) {
      return;
    }
    const off = observerAnalyticWorkoutById(
      user?.uid,
      Date.now(),
      workOutType == 'Double Workout' ? 'double' : 'single',
      dateFilter as any,
      analytic => setAnalytic(analytic),
    );

    return () => {
      off?.();
    };
  }, [user?.uid, workOutType, dateFilter]);

  const dashboardGrids = useMemo(
    () => [
      {
        id: 1,
        title: 'TOTAL KLIMBS',
        value: `${analytic?.totalKlimbs || 0}`,
      },
      {
        id: 2,
        title: 'BEST TIME',
        value: `${getTimeFormat(analytic?.slowestTime || 0, 0)}`,
      },
      {
        id: 3,
        title: 'DISTANCE COMPLETED',
        value: `${Math.round(
          (analytic?.distanceTotal || 0) *
          (user?.systemUnit === 'imp' ? 1 : 0.3048),
        )
          .toString()
          .slice(0, 2)},${Math.round(
            (analytic?.distanceTotal || 0) *
            (user?.systemUnit === 'imp' ? 1 : 0.3048),
          )
            .toString()
            .slice(2)} ${user?.systemUnit === 'imp' ? 'ft' : 'm'}`,
      },
      {
        id: 4,
        title: 'SLOWEST TIME',
        value: `${getTimeFormat(analytic?.bestTime || 0, 0)}`,
      },
      {
        id: 5,
        title: 'EXCERCISE TIME',
        value: `${moment(
          getTimeFormat(analytic?.slowestTime || 0, 0),
          'HH: mm: ss',
        ).hours()} hr ${moment(
          getTimeFormat(analytic?.slowestTime || 0, 0),
          'HH:mm:ss',
        ).minutes()} min`,
      },
      {
        id: 6,
        title: 'AVERAGE TIME',
        value: `${getTimeFormat(analytic?.averageTime || 0, 0)}`,
      },
    ],
    [user?.systemUnit, analytic],
  );
  const dashboardGridsGroup = useMemo(
    () =>
      dashboardGrids.reduce(
        (
          a: Array<dashboardGridsType[]>,
          b: dashboardGridsType,
          index: number,
        ) => {
          //group elements in groups of 2
          if (index % 2 === 0) {
            a.push([b]);
          } else {
            a[a.length - 1].push(b);
          }
          return a;
        },
        [],
      ),
    [dashboardGrids],
  );
  const [montsData, setMontsData] = useState<any[]>([]);
  useEffect(() => {
    if (!user?.uid) {
      return;
    }
    const off = observerMonthsAnalyticWorkoutByYear(
      user?.uid,
      Date.now(),
      workOutType == 'Double Workout' ? 'double' : 'single',
      analytics => setMontsData(analytics),
    );

    return () => {
      off?.();
    };
  }, [user?.uid, workOutType]);

  const chartData = useMemo(() => {
    //array with 12 places
    const months = Array.from({ length: 12 }, (_, i) => {
      return {
        mes: moment().month(i).format('MMM').charAt(0),
        totalTime: montsData
          .filter(m =>
            i < 10 ? m.month === `0${i + 1}` : m.month === `${i + 1}`,
          )
          .map(m1 => Number(m1?.totalTime) || 0),
      };
    });
    let data = (months || [])
      .flatMap(m => m?.totalTime || [])
      .filter(n => !isNaN(n));
    data = data.length ? data : Array.from({ length: 12 }, (_, i) => i * 0);

    return {
      labels: months.map(m => m.mes),
      datasets: [
        {
          data,
          color: () => '#046034',
          strokeWidth: 2.8,
        },
      ],
    };
  }, [montsData]);
  const year = useMemo(() => moment().format('YYYY'), []);
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#046034', '#04603400']}
        style={styles.background}>
        <View style={styles.header}>
          <View>
            <View style={{ alignSelf: 'center' }}>
              <KlimbStatsIcon width={60} height={60} color="#fff" />
            </View>
            <TabLabels
              tabs={dateFilterArray}
              onSelect={setDateFilter}
              selected={dateFilter}
              containerStyles={{ paddingHorizontal: 16 }}
            />
          </View>
        </View>

        <View style={styles.body}>
          <ScrollView
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                height: 50,
                flexDirection: 'row',
                paddingHorizontal: 19,
                marginLeft: -20,
              }}>
              <SelectDropdown
                data={workoutOptions}
                defaultValue={workOutType}
                buttonStyle={{
                  ...styles.button,
                  marginHorizontal: 10,
                  flex: 1,
                }}
                buttonTextStyle={styles.buttonLabel}
                renderDropdownIcon={isOpened => {
                  return (
                    <Icon
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={'#444'}
                      size={12}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdownStyle}
                rowTextStyle={styles.rowStyle}
                onSelect={selectedItem => {
                  setWorkOutType(selectedItem);
                }}
                buttonTextAfterSelection={selectedItem => {
                  return selectedItem;
                }}
                rowTextForSelection={item => {
                  return item;
                }}
              />
              <View style={{ flex: 1, marginLeft: 12 }} />
            </View>
            <View style={styles.dashboardGrids}>
              {dashboardGridsGroup.map((dashboardGrid, index: number) => (
                <View
                  key={`Stats-${index}`}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom:
                      index < dashboardGridsGroup.length - 1 ? 12 : 0,
                  }}>
                  {dashboardGrid.map((grid, gIndex) => (
                    <LinearGradient
                      key={`Stats-${gIndex}-${index}`}
                      colors={['#056135', '#2C9261']}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        height: 65,
                        borderRadius: 10,
                        marginRight: gIndex < dashboardGrid.length - 1 ? 12 : 0,
                        padding: 8,
                      }}>
                      <View
                        style={{
                          flex: 2,
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            textAlign: 'center',
                            fontFamily: 'Montserrat-Regular',
                            fontWeight: '500',
                            fontSize: 12,
                            lineHeight: 13,
                            color: '#fff',
                            textAlignVertical: 'center',
                          }}
                          adjustsFontSizeToFit
                          numberOfLines={1}>
                          {grid.title}
                        </Text>
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                        >
                          {
                            grid.title == 'DISTANCE COMPLETED' ? (
                              <>
                                <Text allowFontScaling={false}
                                  style={styles.gridValue}
                                  numberOfLines={1}
                                  adjustsFontSizeToFit>
                                  {`${Math.round(
                                    (analytic?.distanceTotal || 0) *
                                    (user?.systemUnit === 'imp' ? 1 : 0.3048),
                                  )
                                    .toString()
                                    .slice(0, 2)},${Math.round(
                                      (analytic?.distanceTotal || 0) *
                                      (user?.systemUnit === 'imp' ? 1 : 0.3048),
                                    )
                                      .toString()
                                      .slice(2)}`}
                                </Text>
                                <Text style={styles.smallText}>
                                  {user?.systemUnit === 'imp' ? ' ft' : ' m'}
                                </Text>
                              </>
                            ) : grid.title == 'EXCERCISE TIME' ? <><Text allowFontScaling={false}
                              style={styles.gridValue}
                              numberOfLines={1}
                              adjustsFontSizeToFit>
                              {moment(getTimeFormat(analytic?.bestTime || 0, 0), "HH:mm:ss").format("H")}
                            </Text>
                              <Text style={styles.smallText}>
                                {`${' hr '}`}
                              </Text>
                              <Text allowFontScaling={false}
                                style={styles.gridValue}
                                numberOfLines={1}
                                adjustsFontSizeToFit>
                                {moment(getTimeFormat(analytic?.bestTime || 0, 0), "HH:mm:ss").format("m")}
                              </Text>
                              <Text style={styles.smallText}>
                                {`${' min '}`}
                              </Text>
                            </> : (
                              <Text allowFontScaling={false}
                                style={styles.gridValue}
                                numberOfLines={1}
                                adjustsFontSizeToFit>
                                {grid.value}
                              </Text>
                            )
                          }
                        </Text>
                      </View>
                    </LinearGradient>
                  ))}
                </View>
              ))}
            </View>
            <Text
              allowFontScaling={false}
              style={styles.chartTitleText}>{`${year} KLIMBS`}</Text>

            <View style={{ marginTop: 9, paddingHorizontal: 12 }}>
              <LineChart
                bezier={true}
                data={chartData}
                width={width - 24}
                height={160}
                chartConfig={chartConfig}
                withDots={false}
                withVerticalLines={false}
                style={{
                  borderRadius: 16,
                }}
                formatYLabel={value => {
                  return getTimeFormat(Number(value), 0, false);
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => setLogsOpen(true)}
              style={{
                marginTop: 12,
                marginBottom: 20,
                backgroundColor: '#056135',
                justifyContent: 'center',
                height: 50,
                borderRadius: 100,
                marginHorizontal: 21,
              }}
              activeOpacity={0.6}>
              <LinearGradient
                colors={['#23744D', '#23744D']}
                angle={156.12}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  borderRadius: 100,
                  flexDirection: 'row',
                  padding: 10,
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 16,
                    fontWeight: '500',
                  }}>
                  VIEW KLIMB LOG
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <KlimbLogsModal isOpen={logsOpen} onClose={() => setLogsOpen(false)} />
      </LinearGradient>
    </View>
  );
};

export default Stats;
